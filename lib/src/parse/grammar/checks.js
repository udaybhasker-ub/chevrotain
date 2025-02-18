"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPrefixAlternativesAmbiguities = exports.validateSomeNonEmptyLookaheadPath = exports.validateTooManyAlts = exports.RepetitionCollector = exports.validateAmbiguousAlternationAlternatives = exports.validateEmptyOrAlternative = exports.getFirstNoneTerminal = exports.validateNoLeftRecursion = exports.validateRuleIsOverridden = exports.validateRuleDoesNotAlreadyExist = exports.OccurrenceValidationCollector = exports.identifyProductionForDuplicates = exports.validateGrammar = void 0;
var first_1 = __importDefault(require("lodash/first"));
var isEmpty_1 = __importDefault(require("lodash/isEmpty"));
var drop_1 = __importDefault(require("lodash/drop"));
var flatten_1 = __importDefault(require("lodash/flatten"));
var filter_1 = __importDefault(require("lodash/filter"));
var reject_1 = __importDefault(require("lodash/reject"));
var difference_1 = __importDefault(require("lodash/difference"));
var map_1 = __importDefault(require("lodash/map"));
var forEach_1 = __importDefault(require("lodash/forEach"));
var groupBy_1 = __importDefault(require("lodash/groupBy"));
var reduce_1 = __importDefault(require("lodash/reduce"));
var pickBy_1 = __importDefault(require("lodash/pickBy"));
var values_1 = __importDefault(require("lodash/values"));
var includes_1 = __importDefault(require("lodash/includes"));
var flatMap_1 = __importDefault(require("lodash/flatMap"));
var clone_1 = __importDefault(require("lodash/clone"));
var parser_1 = require("../parser/parser");
var gast_1 = require("./gast/gast");
var lookahead_1 = require("./lookahead");
var interpreter_1 = require("./interpreter");
var gast_public_1 = require("./gast/gast_public");
var gast_visitor_public_1 = require("./gast/gast_visitor_public");
var dropRight_1 = __importDefault(require("lodash/dropRight"));
var compact_1 = __importDefault(require("lodash/compact"));
var tokens_1 = require("../../scan/tokens");
function validateGrammar(topLevels, globalMaxLookahead, tokenTypes, errMsgProvider, grammarName) {
    var duplicateErrors = (0, flatMap_1.default)(topLevels, function (currTopLevel) {
        return validateDuplicateProductions(currTopLevel, errMsgProvider);
    });
    var leftRecursionErrors = (0, flatMap_1.default)(topLevels, function (currTopRule) {
        return validateNoLeftRecursion(currTopRule, currTopRule, errMsgProvider);
    });
    var emptyAltErrors = [];
    var ambiguousAltsErrors = [];
    var emptyRepetitionErrors = [];
    // left recursion could cause infinite loops in the following validations.
    // It is safest to first have the user fix the left recursion errors first and only then examine Further issues.
    if ((0, isEmpty_1.default)(leftRecursionErrors)) {
        emptyAltErrors = (0, flatMap_1.default)(topLevels, function (currTopRule) {
            return validateEmptyOrAlternative(currTopRule, errMsgProvider);
        });
        ambiguousAltsErrors = (0, flatMap_1.default)(topLevels, function (currTopRule) {
            return validateAmbiguousAlternationAlternatives(currTopRule, globalMaxLookahead, errMsgProvider);
        });
        emptyRepetitionErrors = validateSomeNonEmptyLookaheadPath(topLevels, globalMaxLookahead, errMsgProvider);
    }
    var termsNamespaceConflictErrors = checkTerminalAndNoneTerminalsNameSpace(topLevels, tokenTypes, errMsgProvider);
    var tooManyAltsErrors = (0, flatMap_1.default)(topLevels, function (curRule) {
        return validateTooManyAlts(curRule, errMsgProvider);
    });
    var duplicateRulesError = (0, flatMap_1.default)(topLevels, function (curRule) {
        return validateRuleDoesNotAlreadyExist(curRule, topLevels, grammarName, errMsgProvider);
    });
    return duplicateErrors.concat(emptyRepetitionErrors, leftRecursionErrors, emptyAltErrors, ambiguousAltsErrors, termsNamespaceConflictErrors, tooManyAltsErrors, duplicateRulesError);
}
exports.validateGrammar = validateGrammar;
function validateDuplicateProductions(topLevelRule, errMsgProvider) {
    var collectorVisitor = new OccurrenceValidationCollector();
    topLevelRule.accept(collectorVisitor);
    var allRuleProductions = collectorVisitor.allProductions;
    var productionGroups = (0, groupBy_1.default)(allRuleProductions, identifyProductionForDuplicates);
    var duplicates = (0, pickBy_1.default)(productionGroups, function (currGroup) {
        return currGroup.length > 1;
    });
    var errors = (0, map_1.default)((0, values_1.default)(duplicates), function (currDuplicates) {
        var firstProd = (0, first_1.default)(currDuplicates);
        var msg = errMsgProvider.buildDuplicateFoundError(topLevelRule, currDuplicates);
        var dslName = (0, gast_1.getProductionDslName)(firstProd);
        var defError = {
            message: msg,
            type: parser_1.ParserDefinitionErrorType.DUPLICATE_PRODUCTIONS,
            ruleName: topLevelRule.name,
            dslName: dslName,
            occurrence: firstProd.idx
        };
        var param = getExtraProductionArgument(firstProd);
        if (param) {
            defError.parameter = param;
        }
        return defError;
    });
    return errors;
}
function identifyProductionForDuplicates(prod) {
    return "".concat((0, gast_1.getProductionDslName)(prod), "_#_").concat(prod.idx, "_#_").concat(getExtraProductionArgument(prod));
}
exports.identifyProductionForDuplicates = identifyProductionForDuplicates;
function getExtraProductionArgument(prod) {
    if (prod instanceof gast_public_1.Terminal) {
        return prod.terminalType.name;
    }
    else if (prod instanceof gast_public_1.NonTerminal) {
        return prod.nonTerminalName;
    }
    else {
        return "";
    }
}
var OccurrenceValidationCollector = /** @class */ (function (_super) {
    __extends(OccurrenceValidationCollector, _super);
    function OccurrenceValidationCollector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.allProductions = [];
        return _this;
    }
    OccurrenceValidationCollector.prototype.visitNonTerminal = function (subrule) {
        this.allProductions.push(subrule);
    };
    OccurrenceValidationCollector.prototype.visitOption = function (option) {
        this.allProductions.push(option);
    };
    OccurrenceValidationCollector.prototype.visitRepetitionWithSeparator = function (manySep) {
        this.allProductions.push(manySep);
    };
    OccurrenceValidationCollector.prototype.visitRepetitionMandatory = function (atLeastOne) {
        this.allProductions.push(atLeastOne);
    };
    OccurrenceValidationCollector.prototype.visitRepetitionMandatoryWithSeparator = function (atLeastOneSep) {
        this.allProductions.push(atLeastOneSep);
    };
    OccurrenceValidationCollector.prototype.visitRepetition = function (many) {
        this.allProductions.push(many);
    };
    OccurrenceValidationCollector.prototype.visitAlternation = function (or) {
        this.allProductions.push(or);
    };
    OccurrenceValidationCollector.prototype.visitTerminal = function (terminal) {
        this.allProductions.push(terminal);
    };
    return OccurrenceValidationCollector;
}(gast_visitor_public_1.GAstVisitor));
exports.OccurrenceValidationCollector = OccurrenceValidationCollector;
function validateRuleDoesNotAlreadyExist(rule, allRules, className, errMsgProvider) {
    var errors = [];
    var occurrences = (0, reduce_1.default)(allRules, function (result, curRule) {
        if (curRule.name === rule.name) {
            return result + 1;
        }
        return result;
    }, 0);
    if (occurrences > 1) {
        var errMsg = errMsgProvider.buildDuplicateRuleNameError({
            topLevelRule: rule,
            grammarName: className
        });
        errors.push({
            message: errMsg,
            type: parser_1.ParserDefinitionErrorType.DUPLICATE_RULE_NAME,
            ruleName: rule.name
        });
    }
    return errors;
}
exports.validateRuleDoesNotAlreadyExist = validateRuleDoesNotAlreadyExist;
// TODO: is there anyway to get only the rule names of rules inherited from the super grammars?
// This is not part of the IGrammarErrorProvider because the validation cannot be performed on
// The grammar structure, only at runtime.
function validateRuleIsOverridden(ruleName, definedRulesNames, className) {
    var errors = [];
    var errMsg;
    if (!(0, includes_1.default)(definedRulesNames, ruleName)) {
        errMsg =
            "Invalid rule override, rule: ->".concat(ruleName, "<- cannot be overridden in the grammar: ->").concat(className, "<-") +
                "as it is not defined in any of the super grammars ";
        errors.push({
            message: errMsg,
            type: parser_1.ParserDefinitionErrorType.INVALID_RULE_OVERRIDE,
            ruleName: ruleName
        });
    }
    return errors;
}
exports.validateRuleIsOverridden = validateRuleIsOverridden;
function validateNoLeftRecursion(topRule, currRule, errMsgProvider, path) {
    if (path === void 0) { path = []; }
    var errors = [];
    var nextNonTerminals = getFirstNoneTerminal(currRule.definition);
    if ((0, isEmpty_1.default)(nextNonTerminals)) {
        return [];
    }
    else {
        var ruleName = topRule.name;
        var foundLeftRecursion = (0, includes_1.default)(nextNonTerminals, topRule);
        if (foundLeftRecursion) {
            errors.push({
                message: errMsgProvider.buildLeftRecursionError({
                    topLevelRule: topRule,
                    leftRecursionPath: path
                }),
                type: parser_1.ParserDefinitionErrorType.LEFT_RECURSION,
                ruleName: ruleName
            });
        }
        // we are only looking for cyclic paths leading back to the specific topRule
        // other cyclic paths are ignored, we still need this difference to avoid infinite loops...
        var validNextSteps = (0, difference_1.default)(nextNonTerminals, path.concat([topRule]));
        var errorsFromNextSteps = (0, flatMap_1.default)(validNextSteps, function (currRefRule) {
            var newPath = (0, clone_1.default)(path);
            newPath.push(currRefRule);
            return validateNoLeftRecursion(topRule, currRefRule, errMsgProvider, newPath);
        });
        return errors.concat(errorsFromNextSteps);
    }
}
exports.validateNoLeftRecursion = validateNoLeftRecursion;
function getFirstNoneTerminal(definition) {
    var result = [];
    if ((0, isEmpty_1.default)(definition)) {
        return result;
    }
    var firstProd = (0, first_1.default)(definition);
    /* istanbul ignore else */
    if (firstProd instanceof gast_public_1.NonTerminal) {
        result.push(firstProd.referencedRule);
    }
    else if (firstProd instanceof gast_public_1.Alternative ||
        firstProd instanceof gast_public_1.Option ||
        firstProd instanceof gast_public_1.RepetitionMandatory ||
        firstProd instanceof gast_public_1.RepetitionMandatoryWithSeparator ||
        firstProd instanceof gast_public_1.RepetitionWithSeparator ||
        firstProd instanceof gast_public_1.Repetition) {
        result = result.concat(getFirstNoneTerminal(firstProd.definition));
    }
    else if (firstProd instanceof gast_public_1.Alternation) {
        // each sub definition in alternation is a FLAT
        result = (0, flatten_1.default)((0, map_1.default)(firstProd.definition, function (currSubDef) {
            return getFirstNoneTerminal(currSubDef.definition);
        }));
    }
    else if (firstProd instanceof gast_public_1.Terminal) {
        // nothing to see, move along
    }
    else {
        throw Error("non exhaustive match");
    }
    var isFirstOptional = (0, gast_1.isOptionalProd)(firstProd);
    var hasMore = definition.length > 1;
    if (isFirstOptional && hasMore) {
        var rest = (0, drop_1.default)(definition);
        return result.concat(getFirstNoneTerminal(rest));
    }
    else {
        return result;
    }
}
exports.getFirstNoneTerminal = getFirstNoneTerminal;
var OrCollector = /** @class */ (function (_super) {
    __extends(OrCollector, _super);
    function OrCollector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.alternations = [];
        return _this;
    }
    OrCollector.prototype.visitAlternation = function (node) {
        this.alternations.push(node);
    };
    return OrCollector;
}(gast_visitor_public_1.GAstVisitor));
function validateEmptyOrAlternative(topLevelRule, errMsgProvider) {
    var orCollector = new OrCollector();
    topLevelRule.accept(orCollector);
    var ors = orCollector.alternations;
    var errors = (0, flatMap_1.default)(ors, function (currOr) {
        var exceptLast = (0, dropRight_1.default)(currOr.definition);
        return (0, flatMap_1.default)(exceptLast, function (currAlternative, currAltIdx) {
            var possibleFirstInAlt = (0, interpreter_1.nextPossibleTokensAfter)([currAlternative], [], tokens_1.tokenStructuredMatcher, 1);
            if ((0, isEmpty_1.default)(possibleFirstInAlt)) {
                return [
                    {
                        message: errMsgProvider.buildEmptyAlternationError({
                            topLevelRule: topLevelRule,
                            alternation: currOr,
                            emptyChoiceIdx: currAltIdx
                        }),
                        type: parser_1.ParserDefinitionErrorType.NONE_LAST_EMPTY_ALT,
                        ruleName: topLevelRule.name,
                        occurrence: currOr.idx,
                        alternative: currAltIdx + 1
                    }
                ];
            }
            else {
                return [];
            }
        });
    });
    return errors;
}
exports.validateEmptyOrAlternative = validateEmptyOrAlternative;
function validateAmbiguousAlternationAlternatives(topLevelRule, globalMaxLookahead, errMsgProvider) {
    var orCollector = new OrCollector();
    topLevelRule.accept(orCollector);
    var ors = orCollector.alternations;
    // New Handling of ignoring ambiguities
    // - https://github.com/chevrotain/chevrotain/issues/869
    ors = (0, reject_1.default)(ors, function (currOr) { return currOr.ignoreAmbiguities === true; });
    var errors = (0, flatMap_1.default)(ors, function (currOr) {
        var currOccurrence = currOr.idx;
        var actualMaxLookahead = currOr.maxLookahead || globalMaxLookahead;
        var alternatives = (0, lookahead_1.getLookaheadPathsForOr)(currOccurrence, topLevelRule, actualMaxLookahead, currOr);
        var altsAmbiguityErrors = checkAlternativesAmbiguities(alternatives, currOr, topLevelRule, errMsgProvider);
        var altsPrefixAmbiguityErrors = checkPrefixAlternativesAmbiguities(alternatives, currOr, topLevelRule, errMsgProvider);
        return altsAmbiguityErrors.concat(altsPrefixAmbiguityErrors);
    });
    return errors;
}
exports.validateAmbiguousAlternationAlternatives = validateAmbiguousAlternationAlternatives;
var RepetitionCollector = /** @class */ (function (_super) {
    __extends(RepetitionCollector, _super);
    function RepetitionCollector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.allProductions = [];
        return _this;
    }
    RepetitionCollector.prototype.visitRepetitionWithSeparator = function (manySep) {
        this.allProductions.push(manySep);
    };
    RepetitionCollector.prototype.visitRepetitionMandatory = function (atLeastOne) {
        this.allProductions.push(atLeastOne);
    };
    RepetitionCollector.prototype.visitRepetitionMandatoryWithSeparator = function (atLeastOneSep) {
        this.allProductions.push(atLeastOneSep);
    };
    RepetitionCollector.prototype.visitRepetition = function (many) {
        this.allProductions.push(many);
    };
    return RepetitionCollector;
}(gast_visitor_public_1.GAstVisitor));
exports.RepetitionCollector = RepetitionCollector;
function validateTooManyAlts(topLevelRule, errMsgProvider) {
    var orCollector = new OrCollector();
    topLevelRule.accept(orCollector);
    var ors = orCollector.alternations;
    var errors = (0, flatMap_1.default)(ors, function (currOr) {
        if (currOr.definition.length > 255) {
            return [
                {
                    message: errMsgProvider.buildTooManyAlternativesError({
                        topLevelRule: topLevelRule,
                        alternation: currOr
                    }),
                    type: parser_1.ParserDefinitionErrorType.TOO_MANY_ALTS,
                    ruleName: topLevelRule.name,
                    occurrence: currOr.idx
                }
            ];
        }
        else {
            return [];
        }
    });
    return errors;
}
exports.validateTooManyAlts = validateTooManyAlts;
function validateSomeNonEmptyLookaheadPath(topLevelRules, maxLookahead, errMsgProvider) {
    var errors = [];
    (0, forEach_1.default)(topLevelRules, function (currTopRule) {
        var collectorVisitor = new RepetitionCollector();
        currTopRule.accept(collectorVisitor);
        var allRuleProductions = collectorVisitor.allProductions;
        (0, forEach_1.default)(allRuleProductions, function (currProd) {
            var prodType = (0, lookahead_1.getProdType)(currProd);
            var actualMaxLookahead = currProd.maxLookahead || maxLookahead;
            var currOccurrence = currProd.idx;
            var paths = (0, lookahead_1.getLookaheadPathsForOptionalProd)(currOccurrence, currTopRule, prodType, actualMaxLookahead);
            var pathsInsideProduction = paths[0];
            if ((0, isEmpty_1.default)((0, flatten_1.default)(pathsInsideProduction))) {
                var errMsg = errMsgProvider.buildEmptyRepetitionError({
                    topLevelRule: currTopRule,
                    repetition: currProd
                });
                errors.push({
                    message: errMsg,
                    type: parser_1.ParserDefinitionErrorType.NO_NON_EMPTY_LOOKAHEAD,
                    ruleName: currTopRule.name
                });
            }
        });
    });
    return errors;
}
exports.validateSomeNonEmptyLookaheadPath = validateSomeNonEmptyLookaheadPath;
function checkAlternativesAmbiguities(alternatives, alternation, rule, errMsgProvider) {
    var foundAmbiguousPaths = [];
    var identicalAmbiguities = (0, reduce_1.default)(alternatives, function (result, currAlt, currAltIdx) {
        // ignore (skip) ambiguities with this alternative
        if (alternation.definition[currAltIdx].ignoreAmbiguities === true) {
            return result;
        }
        (0, forEach_1.default)(currAlt, function (currPath) {
            var altsCurrPathAppearsIn = [currAltIdx];
            (0, forEach_1.default)(alternatives, function (currOtherAlt, currOtherAltIdx) {
                if (currAltIdx !== currOtherAltIdx &&
                    (0, lookahead_1.containsPath)(currOtherAlt, currPath) &&
                    // ignore (skip) ambiguities with this "other" alternative
                    alternation.definition[currOtherAltIdx].ignoreAmbiguities !== true) {
                    altsCurrPathAppearsIn.push(currOtherAltIdx);
                }
            });
            if (altsCurrPathAppearsIn.length > 1 &&
                !(0, lookahead_1.containsPath)(foundAmbiguousPaths, currPath)) {
                foundAmbiguousPaths.push(currPath);
                result.push({
                    alts: altsCurrPathAppearsIn,
                    path: currPath
                });
            }
        });
        return result;
    }, []);
    var currErrors = (0, map_1.default)(identicalAmbiguities, function (currAmbDescriptor) {
        var ambgIndices = (0, map_1.default)(currAmbDescriptor.alts, function (currAltIdx) { return currAltIdx + 1; });
        var currMessage = errMsgProvider.buildAlternationAmbiguityError({
            topLevelRule: rule,
            alternation: alternation,
            ambiguityIndices: ambgIndices,
            prefixPath: currAmbDescriptor.path
        });
        return {
            message: currMessage,
            type: parser_1.ParserDefinitionErrorType.AMBIGUOUS_ALTS,
            ruleName: rule.name,
            occurrence: alternation.idx,
            alternatives: currAmbDescriptor.alts
        };
    });
    return currErrors;
}
function checkPrefixAlternativesAmbiguities(alternatives, alternation, rule, errMsgProvider) {
    // flatten
    var pathsAndIndices = (0, reduce_1.default)(alternatives, function (result, currAlt, idx) {
        var currPathsAndIdx = (0, map_1.default)(currAlt, function (currPath) {
            return { idx: idx, path: currPath };
        });
        return result.concat(currPathsAndIdx);
    }, []);
    var errors = (0, compact_1.default)((0, flatMap_1.default)(pathsAndIndices, function (currPathAndIdx) {
        var alternativeGast = alternation.definition[currPathAndIdx.idx];
        // ignore (skip) ambiguities with this alternative
        if (alternativeGast.ignoreAmbiguities === true) {
            return [];
        }
        var targetIdx = currPathAndIdx.idx;
        var targetPath = currPathAndIdx.path;
        var prefixAmbiguitiesPathsAndIndices = (0, filter_1.default)(pathsAndIndices, function (searchPathAndIdx) {
            // prefix ambiguity can only be created from lower idx (higher priority) path
            return (
            // ignore (skip) ambiguities with this "other" alternative
            alternation.definition[searchPathAndIdx.idx].ignoreAmbiguities !==
                true &&
                searchPathAndIdx.idx < targetIdx &&
                // checking for strict prefix because identical lookaheads
                // will be be detected using a different validation.
                (0, lookahead_1.isStrictPrefixOfPath)(searchPathAndIdx.path, targetPath));
        });
        var currPathPrefixErrors = (0, map_1.default)(prefixAmbiguitiesPathsAndIndices, function (currAmbPathAndIdx) {
            var ambgIndices = [currAmbPathAndIdx.idx + 1, targetIdx + 1];
            var occurrence = alternation.idx === 0 ? "" : alternation.idx;
            var message = errMsgProvider.buildAlternationPrefixAmbiguityError({
                topLevelRule: rule,
                alternation: alternation,
                ambiguityIndices: ambgIndices,
                prefixPath: currAmbPathAndIdx.path
            });
            return {
                message: message,
                type: parser_1.ParserDefinitionErrorType.AMBIGUOUS_PREFIX_ALTS,
                ruleName: rule.name,
                occurrence: occurrence,
                alternatives: ambgIndices
            };
        });
        return currPathPrefixErrors;
    }));
    return errors;
}
exports.checkPrefixAlternativesAmbiguities = checkPrefixAlternativesAmbiguities;
function checkTerminalAndNoneTerminalsNameSpace(topLevels, tokenTypes, errMsgProvider) {
    var errors = [];
    var tokenNames = (0, map_1.default)(tokenTypes, function (currToken) { return currToken.name; });
    (0, forEach_1.default)(topLevels, function (currRule) {
        var currRuleName = currRule.name;
        if ((0, includes_1.default)(tokenNames, currRuleName)) {
            var errMsg = errMsgProvider.buildNamespaceConflictError(currRule);
            errors.push({
                message: errMsg,
                type: parser_1.ParserDefinitionErrorType.CONFLICT_TOKENS_RULES_NAMESPACE,
                ruleName: currRuleName
            });
        }
    });
    return errors;
}
//# sourceMappingURL=checks.js.map