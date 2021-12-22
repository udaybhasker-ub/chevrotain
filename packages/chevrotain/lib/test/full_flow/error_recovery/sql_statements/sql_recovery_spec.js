"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sql_recovery_tokens_1 = require("./sql_recovery_tokens");
var sql_recovery_parser_1 = require("./sql_recovery_parser");
var tokens_public_1 = require("../../../../src/scan/tokens_public");
var exceptions_public_1 = require("../../../../src/parse/exceptions_public");
var flatten_1 = __importDefault(require("lodash/flatten"));
var matchers_1 = require("../../../utils/matchers");
describe("Error Recovery SQL DDL Example", function () {
    var schemaFQN, shahar32Record, shahar31Record;
    before(function () {
        // for side effect if augmenting the Token classes.
        new sql_recovery_parser_1.DDLExampleRecoveryParser();
        schemaFQN = [
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.IdentTok, "schema2"),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.DotTok),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.IdentTok, "Persons")
        ];
        shahar32Record = [
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.LParenTok),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.IntTok, "32"),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.CommaTok),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.StringTok, "SHAHAR"),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.RParenTok)
        ];
        shahar31Record = [
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.LParenTok),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.IntTok, "31"),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.CommaTok),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.StringTok, '"SHAHAR"'),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.RParenTok)
        ];
    });
    it("can parse a series of three statements successfully", function () {
        var input = (0, flatten_1.default)([
            // CREATE TABLE schema2.Persons
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.CreateTok),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.TableTok),
            schemaFQN,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok),
            // INSERT (32, "SHAHAR") INTO schema2.Persons
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.InsertTok),
            shahar32Record,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.IntoTok),
            schemaFQN,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok),
            // DELETE (31, "SHAHAR") FROM schema2.Persons
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.DeleteTok),
            shahar31Record,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.FromTok),
            schemaFQN,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok)
        ]);
        var parser = new sql_recovery_parser_1.DDLExampleRecoveryParser();
        parser.input = input;
        var ptResult = parser.ddl();
        (0, chai_1.expect)(parser.errors.length).to.equal(0);
        assertAllThreeStatementsPresentAndValid(ptResult);
    });
    describe("Single Token insertion recovery mechanism", function () {
        var input;
        before(function () {
            input = (0, flatten_1.default)([
                // CREATE TABLE schema2.Persons
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.CreateTok),
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.TableTok),
                schemaFQN,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok),
                // INSERT (32, "SHAHAR") INTO schema2.Persons
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.InsertTok),
                shahar32Record,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.IntoTok),
                schemaFQN /*createRegularToken(SemiColonTok), <-- missing semicolon!*/,
                // DELETE (31, "SHAHAR") FROM schema2.Persons
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.DeleteTok),
                shahar31Record,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.FromTok),
                schemaFQN,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok)
            ]);
        });
        it("can perform single token insertion for a missing semicolon", function () {
            var parser = new sql_recovery_parser_1.DDLExampleRecoveryParser();
            parser.input = input;
            var ptResult = parser.ddl();
            // one error encountered
            (0, chai_1.expect)(parser.errors.length).to.equal(1);
            // yet the whole input has been parsed
            // and the output parseTree contains ALL three statements
            assertAllThreeStatementsPresentAndValid(ptResult);
            var insertedSemiColon = ptResult.children[1].children[4].payload;
            // the semicolon is present even though it did not exist in the input, magic!
            (0, chai_1.expect)((0, tokens_public_1.tokenMatcher)(insertedSemiColon, sql_recovery_tokens_1.SemiColonTok)).to.be.true;
            (0, chai_1.expect)(insertedSemiColon.isInsertedInRecovery).to.equal(true);
        });
        it("can disable single token insertion for a missing semicolon", function () {
            var parser = new sql_recovery_parser_1.DDLExampleRecoveryParser(false);
            parser.input = input;
            var ptResult = parser.ddl();
            (0, chai_1.expect)(parser.errors.length).to.equal(1);
            (0, chai_1.expect)(ptResult.payload.tokenType).to.equal(sql_recovery_tokens_1.INVALID_DDL);
            (0, chai_1.expect)(ptResult.children).to.have.length(0);
        });
    });
    describe("Single Token deletion recovery mechanism", function () {
        var input;
        before(function () {
            input = (0, flatten_1.default)([
                // CREATE TABLE schema2.Persons
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.CreateTok),
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.TableTok),
                schemaFQN,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok),
                // INSERT (32, "SHAHAR") INTO INTO schema2.Persons
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.InsertTok),
                shahar32Record,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.IntoTok),
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.IntoTok),
                /* <-- "INTO INTO" oops */ schemaFQN,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok),
                // DELETE (31, "SHAHAR") FROM schema2.Persons
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.DeleteTok),
                shahar31Record,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.FromTok),
                schemaFQN,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok)
            ]);
        });
        it("can perform single token deletion for a redundant keyword", function () {
            var parser = new sql_recovery_parser_1.DDLExampleRecoveryParser();
            parser.input = input;
            var ptResult = parser.ddl();
            // one error encountered
            (0, chai_1.expect)(parser.errors.length).to.equal(1);
            // yet the whole input has been parsed
            // and the output parseTree contains ALL three statements
            assertAllThreeStatementsPresentAndValid(ptResult);
        });
        it("can disable single token deletion for a redundant keyword", function () {
            var parser = new sql_recovery_parser_1.DDLExampleRecoveryParser(false);
            parser.input = input;
            var ptResult = parser.ddl();
            (0, chai_1.expect)(parser.errors.length).to.equal(1);
            (0, chai_1.expect)(ptResult.payload.tokenType).to.equal(sql_recovery_tokens_1.INVALID_DDL);
            (0, chai_1.expect)(ptResult.children).to.have.length(0);
        });
    });
    describe("resync recovery mechanism", function () {
        var badShahar32Record, input;
        before(function () {
            // (32, "SHAHAR" ( <-- wrong parenthesis
            badShahar32Record = [
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.LParenTok),
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.IntTok, "32"),
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.CommaTok),
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.StringTok, '"SHAHAR"'),
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.LParenTok)
            ];
            input = (0, flatten_1.default)([
                // CREATE TABLE schema2.Persons
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.CreateTok),
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.TableTok),
                schemaFQN,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok),
                // issues:
                // 1. FromTok instead of IntoTok so this rule also includes a bug
                // 2. using the bad/invalid record Token.
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.InsertTok),
                badShahar32Record,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.FromTok),
                schemaFQN,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok),
                // DELETE (31, "SHAHAR") FROM schema2.Persons
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.DeleteTok),
                shahar31Record,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.FromTok),
                schemaFQN,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok)
            ]);
        });
        it("can perform re-sync recovery and only 'lose' part of the input", function () {
            var input = (0, flatten_1.default)([
                // CREATE TABLE schema2.Persons
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.CreateTok),
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.TableTok),
                schemaFQN,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok),
                // INSERT (32, "SHAHAR") FROM (( schema2.Persons <-- this can't be recovered with a single token insertion of deletion, must do re-sync
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.InsertTok),
                shahar32Record,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.FromTok),
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.LParenTok),
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.LParenTok),
                schemaFQN,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok),
                // DELETE (31, "SHAHAR") FROM schema2.Persons
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.DeleteTok),
                shahar31Record,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.FromTok),
                schemaFQN,
                (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok)
            ]);
            var parser = new sql_recovery_parser_1.DDLExampleRecoveryParser();
            parser.input = input;
            var ptResult = parser.ddl();
            // one error encountered
            (0, chai_1.expect)(parser.errors.length).to.equal(1);
            // yet the whole input has been parsed
            (0, chai_1.expect)(ptResult.payload.tokenType).to.equal(sql_recovery_tokens_1.STATEMENTS);
            // 3 statements found
            (0, chai_1.expect)(ptResult.children.length).to.equal(3);
            (0, chai_1.expect)(ptResult.children[0].payload.tokenType).to.equal(sql_recovery_tokens_1.CREATE_STMT);
            (0, chai_1.expect)(ptResult.children[0].payload.tokenType).to.not.equal(sql_recovery_tokens_1.INVALID_CREATE_STMT);
            // but the second one is marked as invalid
            (0, chai_1.expect)(ptResult.children[1].payload.tokenType).to.equal(sql_recovery_tokens_1.INVALID_INSERT_STMT);
            // yet the third one is still valid!, we recovered and continued parsing.
            (0, chai_1.expect)(ptResult.children[2].payload.tokenType).to.equal(sql_recovery_tokens_1.DELETE_STMT);
            (0, chai_1.expect)(ptResult.children[2].payload.tokenType).to.not.equal(sql_recovery_tokens_1.INVALID_DELETE_STMT);
        });
        it("can perform re-sync recovery and only 'lose' part of the input even when re-syncing to two rules 'above'", function () {
            var parser = new sql_recovery_parser_1.DDLExampleRecoveryParser();
            parser.input = input;
            var ptResult = parser.ddl();
            // one error encountered
            (0, chai_1.expect)(parser.errors.length).to.equal(1);
            // yet the whole input has been parsed
            (0, chai_1.expect)(ptResult.payload.tokenType).to.equal(sql_recovery_tokens_1.STATEMENTS);
            // 3 statements found
            (0, chai_1.expect)(ptResult.children.length).to.equal(3);
            (0, chai_1.expect)(ptResult.children[0].payload.tokenType).to.equal(sql_recovery_tokens_1.CREATE_STMT);
            (0, chai_1.expect)(ptResult.children[0].payload.tokenType).to.not.equal(sql_recovery_tokens_1.INVALID_CREATE_STMT);
            // but the second one is marked as invalid, this means we kept trying to re-sync to an "higher" rule
            (0, chai_1.expect)(ptResult.children[1].payload.tokenType).to.equal(sql_recovery_tokens_1.INVALID_INSERT_STMT);
            // yet the third one is still valid!, we recovered and continued parsing.
            (0, chai_1.expect)(ptResult.children[2].payload.tokenType).to.equal(sql_recovery_tokens_1.DELETE_STMT);
            (0, chai_1.expect)(ptResult.children[2].payload.tokenType).to.not.equal(sql_recovery_tokens_1.INVALID_DELETE_STMT);
        });
        it("can disable re-sync recovery and only 'lose' part of the input even when re-syncing to two rules 'above'", function () {
            var parser = new sql_recovery_parser_1.DDLExampleRecoveryParser(false);
            parser.input = input;
            var ptResult = parser.ddl();
            // one error encountered
            (0, chai_1.expect)(parser.errors.length).to.equal(1);
            // yet the whole input has been parsed
            (0, chai_1.expect)(ptResult.payload.tokenType).to.equal(sql_recovery_tokens_1.INVALID_DDL);
            (0, chai_1.expect)(ptResult.children).to.have.length(0);
        });
    });
    function assertAllThreeStatementsPresentAndValid(ptResult) {
        (0, chai_1.expect)(ptResult.payload.tokenType).to.equal(sql_recovery_tokens_1.STATEMENTS);
        // 3 statements found
        (0, chai_1.expect)(ptResult.children.length).to.equal(3);
        (0, chai_1.expect)(ptResult.children[0].payload.tokenType).to.equal(sql_recovery_tokens_1.CREATE_STMT);
        (0, chai_1.expect)(ptResult.children[0].payload.tokenType).to.not.equal(sql_recovery_tokens_1.INVALID_CREATE_STMT);
        (0, chai_1.expect)(ptResult.children[1].payload.tokenType).to.equal(sql_recovery_tokens_1.INSERT_STMT);
        (0, chai_1.expect)(ptResult.children[1].payload.tokenType).to.not.equal(sql_recovery_tokens_1.INVALID_INSERT_STMT);
        (0, chai_1.expect)(ptResult.children[2].payload.tokenType).to.equal(sql_recovery_tokens_1.DELETE_STMT);
        (0, chai_1.expect)(ptResult.children[2].payload.tokenType).to.not.equal(sql_recovery_tokens_1.INVALID_DELETE_STMT);
    }
    it("will encounter an NotAllInputParsedException when some of the input vector has not been parsed", function () {
        var input = (0, flatten_1.default)([
            // CREATE TABLE schema2.Persons; TABLE <-- redundant "TABLE" token
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.CreateTok),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.TableTok),
            schemaFQN,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.TableTok)
        ]);
        var parser = new sql_recovery_parser_1.DDLExampleRecoveryParser();
        parser.input = input;
        parser.ddl();
        (0, chai_1.expect)(parser.errors.length).to.equal(1);
        (0, chai_1.expect)(parser.errors[0]).to.be.an.instanceof(exceptions_public_1.NotAllInputParsedException);
    });
    it("can use the same parser instance to parse multiple inputs", function () {
        var input1 = (0, flatten_1.default)([
            // CREATE TABLE schema2.Persons;
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.CreateTok),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.TableTok),
            schemaFQN,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok)
        ]);
        var parser = new sql_recovery_parser_1.DDLExampleRecoveryParser(input1);
        parser.ddl();
        (0, chai_1.expect)(parser.errors.length).to.equal(0);
        var input2 = (0, flatten_1.default)([
            // DELETE (31, "SHAHAR") FROM schema2.Persons
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.DeleteTok),
            shahar31Record,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.FromTok),
            schemaFQN,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok)
        ]);
        // the parser is being reset instead of creating a new instance for each new input
        parser.reset();
        parser.input = input2;
        var ptResult = parser.ddl();
        (0, chai_1.expect)(parser.errors.length).to.equal(0);
        // verify returned ParseTree
        (0, chai_1.expect)(ptResult.payload.tokenType).to.equal(sql_recovery_tokens_1.STATEMENTS);
        (0, chai_1.expect)(ptResult.children.length).to.equal(1);
        (0, chai_1.expect)(ptResult.children[0].payload.tokenType).to.equal(sql_recovery_tokens_1.DELETE_STMT);
        (0, chai_1.expect)(ptResult.children[0].payload.tokenType).to.not.equal(sql_recovery_tokens_1.INVALID_DELETE_STMT);
    });
    it("can re-sync to the next iteration in a MANY rule", function () {
        var input = (0, flatten_1.default)([
            // CREATE TABLE schema2.Persons
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.CreateTok),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.TableTok),
            schemaFQN,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok),
            // INSERT (32, "SHAHAR") INTO schema2.Persons TABLE <-- the redundant 'TABLE' should trigger in repetition recovery
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.InsertTok),
            shahar32Record,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.IntoTok),
            schemaFQN,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok),
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.TableTok),
            // DELETE (31, "SHAHAR") FROM schema2.Persons
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.DeleteTok),
            shahar31Record,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.FromTok),
            schemaFQN,
            (0, matchers_1.createRegularToken)(sql_recovery_tokens_1.SemiColonTok)
        ]);
        var parser = new sql_recovery_parser_1.DDLExampleRecoveryParser();
        parser.input = input;
        var ptResult = parser.ddl();
        (0, chai_1.expect)(parser.errors.length).to.equal(1);
        assertAllThreeStatementsPresentAndValid(ptResult);
    });
});
//# sourceMappingURL=sql_recovery_spec.js.map