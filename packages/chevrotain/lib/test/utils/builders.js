"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeferredTokenBuilder = void 0;
var tokens_public_1 = require("../../src/scan/tokens_public");
function createDeferredTokenBuilder(config) {
    var tokenCache;
    return function createTokenOnDemand() {
        if (tokenCache === undefined) {
            tokenCache = (0, tokens_public_1.createToken)(config);
        }
        return tokenCache;
    };
}
exports.createDeferredTokenBuilder = createDeferredTokenBuilder;
//# sourceMappingURL=builders.js.map