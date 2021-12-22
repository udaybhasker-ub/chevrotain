"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LooksAhead = void 0;
var lookahead_1 = require("../../grammar/lookahead");
var forEach_1 = __importDefault(require("lodash/forEach"));
var has_1 = __importDefault(require("lodash/has"));
var parser_1 = require("../parser");
var keys_1 = require("../../grammar/keys");
var gast_1 = require("../../grammar/gast/gast");
/**
 * Trait responsible for the lookahead related utilities and optimizations.
 */
var LooksAhead = /** @class */ (function () {
    function LooksAhead() {
    }
    LooksAhead.prototype.initLooksAhead = function (config) {
        this.dynamicTokensEnabled = (0, has_1.default)(config, "dynamicTokensEnabled")
            ? config.dynamicTokensEnabled // assumes end user provides the correct config value/type
            : parser_1.DEFAULT_PARSER_CONFIG.dynamicTokensEnabled;
        this.maxLookahead = (0, has_1.default)(config, "maxLookahead")
            ? config.maxLookahead // assumes end user provides the correct config value/type
            : parser_1.DEFAULT_PARSER_CONFIG.maxLookahead;
        this.lookAheadFuncsCache = new Map();
    };
    LooksAhead.prototype.preComputeLookaheadFunctions = function (rules) {
        var _this = this;
        (0, forEach_1.default)(rules, function (currRule) {
            _this.TRACE_INIT("".concat(currRule.name, " Rule Lookahead"), function () {
                var _a = (0, gast_1.collectMethods)(currRule), alternation = _a.alternation, repetition = _a.repetition, option = _a.option, repetitionMandatory = _a.repetitionMandatory, repetitionMandatoryWithSeparator = _a.repetitionMandatoryWithSeparator, repetitionWithSeparator = _a.repetitionWithSeparator;
                (0, forEach_1.default)(alternation, function (currProd) {
                    var prodIdx = currProd.idx === 0 ? "" : currProd.idx;
                    _this.TRACE_INIT("".concat((0, gast_1.getProductionDslName)(currProd)).concat(prodIdx), function () {
                        var laFunc = (0, lookahead_1.buildLookaheadFuncForOr)(currProd.idx, currRule, currProd.maxLookahead || _this.maxLookahead, currProd.hasPredicates, _this.dynamicTokensEnabled, _this.lookAheadBuilderForAlternatives);
                        var key = (0, keys_1.getKeyForAutomaticLookahead)(_this.fullRuleNameToShort[currRule.name], keys_1.OR_IDX, currProd.idx);
                        _this.setLaFuncCache(key, laFunc);
                    });
                });
                (0, forEach_1.default)(repetition, function (currProd) {
                    _this.computeLookaheadFunc(currRule, currProd.idx, keys_1.MANY_IDX, lookahead_1.PROD_TYPE.REPETITION, currProd.maxLookahead, (0, gast_1.getProductionDslName)(currProd));
                });
                (0, forEach_1.default)(option, function (currProd) {
                    _this.computeLookaheadFunc(currRule, currProd.idx, keys_1.OPTION_IDX, lookahead_1.PROD_TYPE.OPTION, currProd.maxLookahead, (0, gast_1.getProductionDslName)(currProd));
                });
                (0, forEach_1.default)(repetitionMandatory, function (currProd) {
                    _this.computeLookaheadFunc(currRule, currProd.idx, keys_1.AT_LEAST_ONE_IDX, lookahead_1.PROD_TYPE.REPETITION_MANDATORY, currProd.maxLookahead, (0, gast_1.getProductionDslName)(currProd));
                });
                (0, forEach_1.default)(repetitionMandatoryWithSeparator, function (currProd) {
                    _this.computeLookaheadFunc(currRule, currProd.idx, keys_1.AT_LEAST_ONE_SEP_IDX, lookahead_1.PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, currProd.maxLookahead, (0, gast_1.getProductionDslName)(currProd));
                });
                (0, forEach_1.default)(repetitionWithSeparator, function (currProd) {
                    _this.computeLookaheadFunc(currRule, currProd.idx, keys_1.MANY_SEP_IDX, lookahead_1.PROD_TYPE.REPETITION_WITH_SEPARATOR, currProd.maxLookahead, (0, gast_1.getProductionDslName)(currProd));
                });
            });
        });
    };
    LooksAhead.prototype.computeLookaheadFunc = function (rule, prodOccurrence, prodKey, prodType, prodMaxLookahead, dslMethodName) {
        var _this = this;
        this.TRACE_INIT("".concat(dslMethodName).concat(prodOccurrence === 0 ? "" : prodOccurrence), function () {
            var laFunc = (0, lookahead_1.buildLookaheadFuncForOptionalProd)(prodOccurrence, rule, prodMaxLookahead || _this.maxLookahead, _this.dynamicTokensEnabled, prodType, _this.lookAheadBuilderForOptional);
            var key = (0, keys_1.getKeyForAutomaticLookahead)(_this.fullRuleNameToShort[rule.name], prodKey, prodOccurrence);
            _this.setLaFuncCache(key, laFunc);
        });
    };
    LooksAhead.prototype.lookAheadBuilderForOptional = function (alt, tokenMatcher, dynamicTokensEnabled) {
        return (0, lookahead_1.buildSingleAlternativeLookaheadFunction)(alt, tokenMatcher, dynamicTokensEnabled);
    };
    LooksAhead.prototype.lookAheadBuilderForAlternatives = function (alts, hasPredicates, tokenMatcher, dynamicTokensEnabled) {
        return (0, lookahead_1.buildAlternativesLookAheadFunc)(alts, hasPredicates, tokenMatcher, dynamicTokensEnabled);
    };
    // this actually returns a number, but it is always used as a string (object prop key)
    LooksAhead.prototype.getKeyForAutomaticLookahead = function (dslMethodIdx, occurrence) {
        var currRuleShortName = this.getLastExplicitRuleShortName();
        return (0, keys_1.getKeyForAutomaticLookahead)(currRuleShortName, dslMethodIdx, occurrence);
    };
    LooksAhead.prototype.getLaFuncFromCache = function (key) {
        return this.lookAheadFuncsCache.get(key);
    };
    /* istanbul ignore next */
    LooksAhead.prototype.setLaFuncCache = function (key, value) {
        this.lookAheadFuncsCache.set(key, value);
    };
    return LooksAhead;
}());
exports.LooksAhead = LooksAhead;
//# sourceMappingURL=looksahead.js.map