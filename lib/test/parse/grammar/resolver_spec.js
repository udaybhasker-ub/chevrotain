"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resolver_1 = require("../../../src/parse/grammar/resolver");
var parser_1 = require("../../../src/parse/parser/parser");
var gast_public_1 = require("../../../src/parse/grammar/gast/gast_public");
var errors_public_1 = require("../../../src/parse/errors_public");
var chai_1 = require("chai");
describe("The RefResolverVisitor", function () {
    it("will fail when trying to resolve a ref to a grammar rule that does not exist", function () {
        var ref = new gast_public_1.NonTerminal({ nonTerminalName: "missingRule" });
        var topLevel = new gast_public_1.Rule({ name: "TOP", definition: [ref] });
        var topLevelRules = {};
        topLevelRules["TOP"] = topLevel;
        var resolver = new resolver_1.GastRefResolverVisitor(topLevelRules, errors_public_1.defaultGrammarResolverErrorProvider);
        resolver.resolveRefs();
        (0, chai_1.expect)(resolver.errors).to.have.lengthOf(1);
        (0, chai_1.expect)(resolver.errors[0].message).to.contain("Invalid grammar, reference to a rule which is not defined: ->missingRule<-");
        (0, chai_1.expect)(resolver.errors[0].message).to.contain("inside top level rule: ->TOP<-");
        (0, chai_1.expect)(resolver.errors[0].type).to.equal(parser_1.ParserDefinitionErrorType.UNRESOLVED_SUBRULE_REF);
        (0, chai_1.expect)(resolver.errors[0].ruleName).to.equal("TOP");
    });
});
//# sourceMappingURL=resolver_spec.js.map