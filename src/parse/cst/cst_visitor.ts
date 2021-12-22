import isEmpty from "lodash/isEmpty"
import compact from "lodash/compact"
import isArray from "lodash/isArray"
import map from "lodash/map"
import forEach from "lodash/forEach"
import filter from "lodash/filter"
import keys from "lodash/keys"
import isFunction from "lodash/isFunction"
import isUndefined from "lodash/isUndefined"
import includes from "lodash/includes"
import { defineNameProp } from "../../lang/lang_extensions"
import { CstNode, ICstVisitor } from "@chevrotain/types"

export function defaultVisit<IN>(ctx: any, param: any, matchingIndices?: any): void {
  const childrenNames = keys(ctx);
  const childrenNamesLength = childrenNames.length;
  for (let i = 0; i < childrenNamesLength; i++) {
    const currChildName = childrenNames[i];
    if (currChildName === 'name') return;
    const currChildArray = ctx[currChildName];
    const currChildArrayLength = currChildArray.length;

    for (var j = 0; j < currChildArrayLength; j++) {
      const currChild = currChildArray[j];
      // distinction between Tokens Children and CstNode children
      if (currChild.tokenTypeIdx === undefined) {
        if (currChild.fullName !== undefined) {
          param = appendPathToParam(currChild.fullName, param);
          this[currChild.fullName](currChild.children, param);
        }
        else {
          let name = currChild.name;
          let hasIndex = false;
          let indexMap = getMatchingIndexMap(currChild.name, matchingIndices || (param && param.matchingIndices));
          if (indexMap) {
            name = indexMap['name'] + '~' + indexMap['index'];
            if (j != indexMap['index']) {
              if (j > 0 && currChildArrayLength > 1) {
                continue;
              }
            }
            hasIndex = true;
          } else if (this && this.collectorName) {
            let parts = this.collectorName.split('~');
            if (parts.length > 1 && parts[0] === currChild.name) {
              name = this.collectorName;

              if (parts[1] != j) {
                if (j > 0 && currChildArrayLength > 1) {
                  continue;
                }
              }
              hasIndex = true;
            }
          }

          param = appendPathToParam(name, param);
          if (hasIndex && !this[name]) {
            name = currChild.name;
          }
          this[name](currChild.children, param);
        }
      } else {
        if (this[currChild.tokenType.name]) {
          param = appendPathToParam(currChild.tokenType.name, param);
          this[currChild.tokenType.name](currChild, param);
          if (param && param.path) param.path = '';
        }
      }
    }
  }
  // defaultVisit does not support generic out param
  return undefined;
}
function getMatchingIndexMap(step: any, matchingIndices: any) {
  let retIndexMap;
  matchingIndices && matchingIndices.map((indexMap: any) => {
    let parts = indexMap.name.split('~');
    if (parts[0] === step) {
      retIndexMap = indexMap;
      return;
    }
  });
  return retIndexMap;
}
function appendPathToParam(step: any, param: any) {
  if (!step) return;
  if (!param) param = {};
  if (!param.path) param.path = '';
  param.path = (param.path ? param.path + '>' : '') + step;
  return param;
}
export function createBaseSemanticVisitorConstructor(
  grammarName: string,
  ruleNames: string[]
): {
  new(...args: any[]): ICstVisitor<any, any>
} {
  const derivedConstructor: any = function () { }

  // can be overwritten according to:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/
  // name?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FFunction%2Fname
  defineNameProp(derivedConstructor, grammarName + "BaseSemantics")

  const semanticProto = {
    visit: function (cstNode: any | any[], param: any) {
      // enables writing more concise visitor methods when CstNode has only a single child
      if (isArray(cstNode)) {
        // A CST Node's children dictionary can never have empty arrays as values
        // If a key is defined there will be at least one element in the corresponding value array.
        cstNode = cstNode[0];
      }
      // enables passing optional CstNodes concisely.
      if (isUndefined(cstNode)) {
        return undefined;
      }
      if (cstNode.fullName !== undefined) {
        param = appendPathToParam(cstNode.fullName, param);
        return this[cstNode.fullName](cstNode.children, param);
      }
      else {
        if (cstNode.tokenTypeIdx) {
          param = appendPathToParam(cstNode.tokenType.name, param);
          return this[cstNode.tokenType.name](cstNode, param);
        }
        if (param && param.matchingIndices && param.matchingIndices.length) {
          return defaultVisit.call(this, cstNode.children, param, param.matchingIndices);
        } else {
          let parts = cstNode.name.split('~');
          if (parts.length > 1) {
            return defaultVisit.call(this, cstNode.children, param, [{ name: parts[0], index: parts[1] }]);
          }
        }
        return this[cstNode.name](cstNode.children, param, param && param.matchingIndices);
      }
    },

    validateVisitor: function () {
      const semanticDefinitionErrors = validateVisitor(this, ruleNames)
      if (!isEmpty(semanticDefinitionErrors)) {
        const errorMessages = map(
          semanticDefinitionErrors,
          (currDefError) => currDefError.msg
        )
        throw Error(
          `Errors Detected in CST Visitor <${this.constructor.name}>:\n\t` +
          `${errorMessages.join("\n\n").replace(/\n/g, "\n\t")}`
        )
      }
    }
  }

  derivedConstructor.prototype = semanticProto
  derivedConstructor.prototype.constructor = derivedConstructor

  derivedConstructor._RULE_NAMES = ruleNames

  return derivedConstructor
}

export function createBaseVisitorConstructorWithDefaults(
  grammarName: string,
  ruleNames: string[],
  baseConstructor: Function
): {
  new(...args: any[]): ICstVisitor<any, any>
} {
  const derivedConstructor: any = function () { }

  // can be overwritten according to:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/
  // name?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FFunction%2Fname
  defineNameProp(derivedConstructor, grammarName + "BaseSemanticsWithDefaults")

  const withDefaultsProto = Object.create(baseConstructor.prototype)
  forEach(ruleNames, (ruleName) => {
    withDefaultsProto[ruleName] = defaultVisit
  })

  derivedConstructor.prototype = withDefaultsProto
  derivedConstructor.prototype.constructor = derivedConstructor

  return derivedConstructor
}

export enum CstVisitorDefinitionError {
  REDUNDANT_METHOD,
  MISSING_METHOD
}

export interface IVisitorDefinitionError {
  msg: string
  type: CstVisitorDefinitionError
  methodName: string
}

export function validateVisitor(
  visitorInstance: ICstVisitor<unknown, unknown>,
  ruleNames: string[]
): IVisitorDefinitionError[] {
  const missingErrors = validateMissingCstMethods(visitorInstance, ruleNames)
  const redundantErrors = validateRedundantMethods(visitorInstance, ruleNames)

  return missingErrors.concat(redundantErrors)
}

export function validateMissingCstMethods(
  visitorInstance: ICstVisitor<unknown, unknown>,
  ruleNames: string[]
): IVisitorDefinitionError[] {
  const missingRuleNames = filter(ruleNames, (currRuleName) => {
    return isFunction((visitorInstance as any)[currRuleName]) === false
  })

  const errors: IVisitorDefinitionError[] = map(
    missingRuleNames,
    (currRuleName) => {
      return {
        msg: `Missing visitor method: <${currRuleName}> on ${<any>(
          visitorInstance.constructor.name
        )} CST Visitor.`,
        type: CstVisitorDefinitionError.MISSING_METHOD,
        methodName: currRuleName
      }
    }
  )

  return compact<IVisitorDefinitionError>(errors)
}

const VALID_PROP_NAMES = ["constructor", "visit", "validateVisitor"]
export function validateRedundantMethods(
  visitorInstance: ICstVisitor<unknown, unknown>,
  ruleNames: string[]
): IVisitorDefinitionError[] {
  const errors = []

  for (const prop in visitorInstance) {
    if (
      isFunction((visitorInstance as any)[prop]) &&
      !includes(VALID_PROP_NAMES, prop) &&
      !includes(ruleNames, prop)
    ) {
      errors.push({
        msg:
          `Redundant visitor method: <${prop}> on ${<any>(
            visitorInstance.constructor.name
          )} CST Visitor\n` +
          `There is no Grammar Rule corresponding to this method's name.\n`,
        type: CstVisitorDefinitionError.REDUNDANT_METHOD,
        methodName: prop
      })
    }
  }
  return errors
}
