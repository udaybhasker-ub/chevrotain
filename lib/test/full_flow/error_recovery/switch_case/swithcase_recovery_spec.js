"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Switchcase_recovery_tokens_1 = require("./Switchcase_recovery_tokens");
var switchcase_recovery_parser_1 = require("./switchcase_recovery_parser");
var exceptions_public_1 = require("../../../../src/parse/exceptions_public");
var matchers_1 = require("../../../utils/matchers");
var chai_1 = require("chai");
describe("Error Recovery switch-case Example", function () {
    before(function () {
        // called for side effect of augmenting
        new switchcase_recovery_parser_1.SwitchCaseRecoveryParser([]);
    });
    it("can parse a valid text successfully", function () {
        var input = [
            // switch (name) {
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SwitchTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.LParenTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IdentTok, "name"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.RParenTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.LCurlyTok),
            // case "Terry" : return 2;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Terry"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "2"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            // case "Robert" : return 4;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Robert"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "4"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            // case "Brandon" : return 6;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Brandon"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "6"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.RCurlyTok)
        ];
        var parser = new switchcase_recovery_parser_1.SwitchCaseRecoveryParser();
        parser.input = input;
        var parseResult = parser.switchStmt();
        (0, chai_1.expect)(parser.errors.length).to.equal(0);
        (0, chai_1.expect)(parseResult).to.deep.equal({
            Terry: 2,
            Robert: 4,
            Brandon: 6
        });
    });
    it("can perform re-sync recovery to the next case stmt", function () {
        var input = [
            // switch (name) {
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SwitchTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.LParenTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IdentTok, "name"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.RParenTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.LCurlyTok),
            // case "Terry" : return 2;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Terry"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "2"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            // case "Robert" ::: return 4; <-- using 3 colons to trigger re-sync recovery
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Robert"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok, ":"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok, ":"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok, ":"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok, "return"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "4"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok, ";"),
            // case "Brandon" : return 6;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Brandon"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "6"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.RCurlyTok)
        ];
        var parser = new switchcase_recovery_parser_1.SwitchCaseRecoveryParser();
        parser.input = input;
        var parseResult = parser.switchStmt();
        (0, chai_1.expect)(parseResult).to.deep.equal({
            Terry: 2,
            invalid1: undefined,
            Brandon: 6
        });
        (0, chai_1.expect)(parser.errors.length).to.equal(1);
        (0, chai_1.expect)(parser.errors[0].resyncedTokens).to.have.lengthOf(4);
        (0, chai_1.expect)(parser.errors[0].resyncedTokens[0].image).to.equal(":");
        (0, chai_1.expect)(parser.errors[0].resyncedTokens[1].image).to.equal("return");
        (0, chai_1.expect)(parser.errors[0].resyncedTokens[2].image).to.equal("4");
        (0, chai_1.expect)(parser.errors[0].resyncedTokens[3].image).to.equal(";");
    });
    it("will detect an error if missing AT_LEAST_ONCE occurrence", function () {
        var input = [
            // switch (name) { }
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SwitchTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.LParenTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IdentTok, "name"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.RParenTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.LCurlyTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.RCurlyTok)
        ];
        var parser = new switchcase_recovery_parser_1.SwitchCaseRecoveryParser();
        parser.input = input;
        var parseResult = parser.switchStmt();
        (0, chai_1.expect)(parser.errors.length).to.equal(1);
        (0, chai_1.expect)(parser.errors[0]).to.be.an.instanceof(exceptions_public_1.EarlyExitException);
        (0, chai_1.expect)(parseResult).to.deep.equal({});
    });
    it("can perform re-sync recovery to the next case stmt even if the unexpected tokens are between valid case stmts", function () {
        var input = [
            // switch (name) {
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SwitchTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.LParenTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IdentTok, "name"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.RParenTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.LCurlyTok),
            // case "Terry" : return 2;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Terry"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "2"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            // case "Robert" : return 4;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Robert"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "4"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            // "ima" "aba" "bamba" <-- these three strings do not belong here, but instead of failing everything
            // we should still get a valid output as these tokens will be ignored and the parser will re-sync to the next case stmt
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "ima"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "aba"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "bamba"),
            // case "Brandon" : return 6;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Brandon"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "6"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.RCurlyTok)
        ];
        var parser = new switchcase_recovery_parser_1.SwitchCaseRecoveryParser();
        parser.input = input;
        var parseResult = parser.switchStmt();
        (0, chai_1.expect)(parser.errors.length).to.equal(1);
        (0, chai_1.expect)(parseResult).to.deep.equal({
            Terry: 2,
            Robert: 4,
            Brandon: 6
        });
    });
    it("can perform re-sync recovery to the right curly after the case statements repetition", function () {
        var input = [
            // switch (name) {
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SwitchTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.LParenTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IdentTok, "name"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.RParenTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.LCurlyTok),
            // case "Terry" : return 2;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Terry"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "2"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            // case "Robert" : return 4;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Robert"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "4"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            // case "Brandon" : return 6;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Brandon"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "6"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "ima"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "aba"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "bamba"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.RCurlyTok)
        ];
        var parser = new switchcase_recovery_parser_1.SwitchCaseRecoveryParser();
        parser.input = input;
        var parseResult = parser.switchStmt();
        (0, chai_1.expect)(parser.errors.length).to.equal(1);
        (0, chai_1.expect)(parseResult).to.deep.equal({
            Terry: 2,
            Robert: 4,
            Brandon: 6
        });
        (0, chai_1.expect)(parser.errors.length).to.equal(1);
        (0, chai_1.expect)(parser.errors[0].resyncedTokens).to.have.lengthOf(2);
        (0, chai_1.expect)(parser.errors[0].token.image).to.equal("ima");
        (0, chai_1.expect)(parser.errors[0].resyncedTokens[0].image).to.equal("aba");
        (0, chai_1.expect)(parser.errors[0].resyncedTokens[1].image).to.equal("bamba");
    });
    it("can perform single token deletion recovery", function () {
        var input = [
            // switch (name) {
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SwitchTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.LParenTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IdentTok, "name"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.RParenTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.LCurlyTok),
            // case "Terry" : return 2;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Terry"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "2"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            // case "Robert" : return 4;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Robert"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "4"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            // case "Brandon" : return 6;
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Brandon"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "6"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.RCurlyTok)
        ];
        var parser = new switchcase_recovery_parser_1.SwitchCaseRecoveryParser();
        parser.input = input;
        var parseResult = parser.switchStmt();
        (0, chai_1.expect)(parser.errors.length).to.equal(1);
        (0, chai_1.expect)(parseResult).to.deep.equal({
            Terry: 2,
            Robert: 4,
            Brandon: 6
        });
    });
    it("will perform single token insertion for a missing colon", function () {
        var input = [
            // case "Terry" return 2 <-- missing the colon between "Terry" and return
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.StringTok, "Terry"),
            /* createRegularToken(ColonTok) ,*/ (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "2"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok)
        ];
        var parser = new switchcase_recovery_parser_1.SwitchCaseRecoveryParser();
        parser.input = input;
        var parseResult = parser.caseStmt();
        (0, chai_1.expect)(parser.errors.length).to.equal(1);
        (0, chai_1.expect)(parser.errors[0]).to.be.an.instanceof(exceptions_public_1.MismatchedTokenException);
        (0, chai_1.expect)(parseResult).to.deep.equal({ Terry: 2 });
    });
    it("will NOT perform single token insertion for a missing string", function () {
        var input = [
            // case  : return 2 <-- missing the string for the case's value
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.CaseTok),
            /* new StringTok("Terry" , 0, 1, 1),*/ (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ColonTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.ReturnTok),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.IntTok, "2"),
            (0, matchers_1.createRegularToken)(Switchcase_recovery_tokens_1.SemiColonTok)
        ];
        var parser = new switchcase_recovery_parser_1.SwitchCaseRecoveryParser();
        parser.input = input;
        var parseResult = parser.caseStmt();
        (0, chai_1.expect)(parser.errors.length).to.equal(1);
        (0, chai_1.expect)(parser.errors[0]).to.be.an.instanceof(exceptions_public_1.MismatchedTokenException);
        (0, chai_1.expect)(parseResult).to.deep.equal({ invalid1: undefined });
    });
});
//# sourceMappingURL=swithcase_recovery_spec.js.map