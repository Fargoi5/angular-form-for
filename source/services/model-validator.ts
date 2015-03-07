/// <reference path="../../definitions/angular.d.ts" />
/// <reference path="form-for-configuration.ts" />

module formFor {

  /**
   * Model validation service.
   */
  export class ModelValidator {

    private $interpolate_:ng.IInterpolateService;
    private formForConfiguration_:FormForConfiguration;
    private nestedObjectHelper_:NestedObjectHelper;
    private promiseUtils_:PromiseUtils;

    /**
     * Constructor.
     *
     * @param $interpolate Injector-supplied $interpolate service
     * @param $parse Injecter-supplied $parse service
     * @param $q Injector-supplied $q service
     * @param formForConfiguration
     */
    constructor($interpolate:ng.IInterpolateService,
                $parse:ng.IParseService,
                $q:ng.IQService,
                formForConfiguration:FormForConfiguration) {
      this.$interpolate_ = $interpolate;
      this.formForConfiguration_ = formForConfiguration;

      this.nestedObjectHelper_ = new NestedObjectHelper($parse);
      this.promiseUtils_ = new PromiseUtils($q);
    }

    /**
     * Determines if the specified collection is required (requires a minimum number of items).
     *
     * @param fieldName Name of field containing the collection.
     * @param validationRuleSet Map of field names to validation rules
     */
    public isCollectionRequired(fieldName:string, validationRuleSet:ValidationRuleSet):boolean {
      var validationRules:ValidationRules = this.getRulesFor_(fieldName, validationRuleSet);

      if (validationRules &&
        validationRules.collection &&
        validationRules.collection.min) {

        if (angular.isObject(validationRules.collection.min)) {
          return (<ValidationRuleNumber> validationRules.collection.min).rule > 0;
        } else {
          return validationRules.collection.min > 0;
        }
      }

      return false;
    }

    /**
     * Determines if the specified field is flagged as required.
     *
     * @param fieldName Name of field in question.
     * @param validationRuleSet Map of field names to validation rules
     */
    public isFieldRequired(fieldName:string, validationRuleSet:ValidationRuleSet):boolean {
      var validationRules:ValidationRules = this.getRulesFor_(fieldName, validationRuleSet);

      if (validationRules && validationRules.required) {
        if (angular.isObject(validationRules.required)) {
          return (<ValidationRuleBoolean> validationRules.required).rule;
        } else {
          return !!validationRules.required;
        }
      }

      return false;
    }

    /**
     * Validates the model against all rules in the validationRules.
     * This method returns a promise to be resolved on successful validation,
     * or rejected with a map of field-name to error-message.
     *
     * @param formData Form-data object model is contained within
     * @param validationRuleSet Map of field names to validation rules
     * @return Promise to be resolved or rejected based on validation success or failure.
     */
    public validateAll(formData:Object, validationRuleSet:ValidationRuleSet):ng.IPromise<string> {
      var fieldNames:Array<string> = this.nestedObjectHelper_.flattenObjectKeys(formData);

      return this.validateFields(formData, fieldNames, validationRuleSet);
    }

    /**
     * Validate the properties of a collection (but not the items within the collection).
     * This method returns a promise to be resolved on successful validation or rejected with an error message.
     *
     * @param formData Form-data object model is contained within
     * @param fieldName Name of collection to validate
     * @param validationRuleSet Map of field names to validation rules
     * @return Promise to be resolved or rejected based on validation success or failure.
     */
    public validateCollection(formData:Object, fieldName:string, validationRuleSet:ValidationRuleSet):ng.IPromise<any> {
      var validationRules:ValidationRules = this.getRulesFor_(fieldName, validationRuleSet);
      var collection:Array<any> = this.nestedObjectHelper_.readAttribute(formData, fieldName);

      if (validationRules && validationRules.collection) {
        collection = collection || [];

        return this.validateCollectionMinLength_(collection, validationRules.collection) ||
          this.validateCollectionMaxLength_(collection, validationRules.collection) ||
          this.promiseUtils_.resolve();
      }

      return this.promiseUtils_.resolve();
    }

    /**
     * Validates a value against the related rule-set (within validationRules).
     * This method returns a promise to be resolved on successful validation.
     * If validation fails the promise will be rejected with an error message.
     *
     * @param formData Form-data object model is contained within.
     * @param fieldName Name of field used to associate the rule-set map with a given value.
     * @param validationRuleSet Map of field names to validation rules
     * @return Promise to be resolved or rejected based on validation success or failure.
     */
    public validateField(formData:Object, fieldName:string, validationRuleSet:ValidationRuleSet):ng.IPromise<any> {
      var validationRules:ValidationRules = this.getRulesFor_(fieldName, validationRuleSet);
      var value:any = this.nestedObjectHelper_.readAttribute(formData, fieldName);

      if (validationRules) {
        if (value === undefined || value === null) {
          value = ""; // Escape falsy values liked null or undefined, but not ones like 0
        }

        return this.validateFieldRequired_(value, validationRules) ||
          this.validateFieldMinLength_(value, validationRules) ||
          this.validateFieldMaxLength_(value, validationRules) ||
          this.validateFieldType_(value, validationRules) ||
          this.validateFieldPattern_(value, validationRules) ||
          this.validateFieldCustom_(value, formData, validationRules) ||
          this.promiseUtils_.resolve();
      }

      return this.promiseUtils_.resolve();
    }

    /**
     * Validates the values in model with the rules defined in the current validationRules.
     * This method returns a promise to be resolved on successful validation,
     * or rejected with a map of field-name to error-message.
     *
     * @param formData Form-data object model is contained within
     * @param fieldNames White-list set of fields to validate for the given model.
     *                   Values outside of this list will be ignored.
     * @param validationRuleSet Map of field names to validation rules
     * @return Promise to be resolved or rejected based on validation success or failure.
     */
    public validateFields(formData:Object, fieldNames:Array<string>, validationRuleSet:ValidationRuleSet):ng.IPromise<any> {
      var deferred:ng.IDeferred<any> = this.promiseUtils_.defer();
      var promises:Array<ng.IPromise<any>> = [];
      var errorMap:ValidationErrorMap = {};

      angular.forEach(fieldNames, (fieldName:string) => {
        var validationRules:ValidationRules = this.getRulesFor_(fieldName, validationRuleSet);

        if (validationRules) {
          var promise:ng.IPromise<any>;

          if (validationRules.collection) {
            promise = this.validateCollection(formData, fieldName, validationRuleSet);
          } else {
            promise = this.validateField(formData, fieldName, validationRuleSet);
          }

          promise.then(
            angular.noop,
            (error) => {
              this.nestedObjectHelper_.writeAttribute(errorMap, fieldName, error);
            });

          promises.push(promise);
        }
      }, this);

      // Wait until all validations have finished before proceeding; bundle up the error messages if any failed.
      this.promiseUtils_.waitForAll(promises).then(
        deferred.resolve,
        () => {
          deferred.reject(errorMap);
        });

      return deferred.promise;
    }

    // Helper methods ////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Strip array brackets from field names so that model values can be mapped to rules.
     * e.g. "foo[0].bar" should be validated against "foo.collection.fields.bar"
     *
     * @private
     */
    private getRulesFor_(fieldName:string, validationRuleSet:ValidationRuleSet):ValidationRules {
      var expandedFieldName:string = fieldName.replace(/\[[^\]]+\]/g, '.collection.fields');

      return this.nestedObjectHelper_.readAttribute(validationRuleSet, expandedFieldName);
    }

    private getFieldTypeFailureMessage_(validationRules:ValidationRules, failureType:ValidationFailureType):string {
      return angular.isObject(validationRules.type) ?
        (<ValidationRuleFieldType> validationRules.type).message :
        this.formForConfiguration_.getFailedValidationMessage(failureType);

    }

    /**
     * Determining if numeric input has been provided.
     * This guards against the fact that `new Number('') == 0`.
     * @private
     */
    private static isConsideredNumeric_(stringValue:string, numericValue:number):boolean {
      return stringValue && !isNaN(numericValue);
    }

    // Validation helper methods /////////////////////////////////////////////////////////////////////////////////////////

    private validateCollectionMinLength_(collection:any, validationRuleCollection:ValidationRuleCollection):any {
      if (validationRuleCollection.min) {
        var min:number =
          angular.isObject(validationRuleCollection.min) ?
            (<ValidationRuleNumber> validationRuleCollection.min).rule :
            <number> validationRuleCollection.min;

        if (collection.length < min) {
          var failureMessage:string;

          if (angular.isObject(validationRuleCollection.min)) {
            failureMessage = (<ValidationRuleNumber> validationRuleCollection.min).message;
          } else {
            failureMessage =
              this.$interpolate_(
                this.formForConfiguration_.getFailedValidationMessage(
                  ValidationFailureType.COLLECTION_MIN_SIZE))({num: min});
          }

          return this.promiseUtils_.reject(failureMessage);
        }
      }

      return null;
    }

    private validateCollectionMaxLength_(collection:any, validationRuleCollection:ValidationRuleCollection):any {
      if (validationRuleCollection.max) {
        var max:number =
          angular.isObject(validationRuleCollection.max) ?
            (<ValidationRuleNumber> validationRuleCollection.max).rule :
            <number> validationRuleCollection.max;

        if (collection.length > max) {
          var failureMessage:string;

          if (angular.isObject(validationRuleCollection.max)) {
            failureMessage = (<ValidationRuleNumber> validationRuleCollection.max).message;
          } else {
            failureMessage =
              this.$interpolate_(
                this.formForConfiguration_.getFailedValidationMessage(
                  ValidationFailureType.COLLECTION_MAX_SIZE))({num: max});
          }

          return this.promiseUtils_.reject(failureMessage);
        }
      }

      return null;
    }

    private validateFieldCustom_(value:any, formData:any, validationRules:ValidationRules):any {
      if (validationRules.custom) {
        var defaultErrorMessage:string;
        var validationFunction:CustomValidationFunction;

        if (angular.isFunction(validationRules.custom)) {
          defaultErrorMessage = this.formForConfiguration_.getFailedValidationMessage(ValidationFailureType.CUSTOM);
          validationFunction = <(value:any, formData:any) => boolean> validationRules.custom;
        } else {
          defaultErrorMessage = (<ValidationRuleCustom> validationRules.custom).message;
          validationFunction = (<ValidationRuleCustom> validationRules.custom).rule;
        }

        // Validations can fail in 3 ways:
        // A promise that gets rejected (potentially with an error message)
        // An error that gets thrown (potentially with a message)
        // A falsy value

        try {
          var returnValue:any = validationFunction(value, formData);
        } catch (error) {
          return this.promiseUtils_.reject(error.message || defaultErrorMessage);
        }

        if (angular.isObject(returnValue) && angular.isFunction(returnValue.then)) {
          return returnValue.then(
            (reason:any) => {
              return this.promiseUtils_.resolve(reason);
            },
            (reason:any) => {
              return this.promiseUtils_.reject(reason || defaultErrorMessage);
            });
        } else if (returnValue) {
          return this.promiseUtils_.resolve(returnValue);
        } else {
          return this.promiseUtils_.reject(defaultErrorMessage);
        }
      }

      return null;
    }

    private validateFieldMaxLength_(value:any, validationRules:ValidationRules):any {
      if (validationRules.maxlength) {
        var maxlength:number = angular.isObject(validationRules.maxlength) ?
          (<ValidationRuleNumber> validationRules.maxlength).rule :
          <number> validationRules.maxlength;

        if (value.length > maxlength) {
          var failureMessage:string;

          if (angular.isObject(validationRules.maxlength)) {
            failureMessage = (<ValidationRuleNumber> validationRules.maxlength).message;
          } else {
            failureMessage =
              this.$interpolate_(
                this.formForConfiguration_.getFailedValidationMessage(
                  ValidationFailureType.MAX_LENGTH))({num: maxlength});
          }

          return this.promiseUtils_.reject(failureMessage);
        }
      }

      return null;
    }

    private validateFieldMinLength_(value:any, validationRules:ValidationRules):any {
      if (validationRules.minlength) {
        var minlength:number = angular.isObject(validationRules.minlength) ?
          (<ValidationRuleNumber> validationRules.minlength).rule :
          <number> validationRules.minlength;

        if (value && value.length < minlength) {
          var failureMessage:string;

          if (angular.isObject(validationRules.minlength)) {
            failureMessage = (<ValidationRuleNumber> validationRules.minlength).message;
          } else {
            failureMessage =
              this.$interpolate_(
                this.formForConfiguration_.getFailedValidationMessage(
                  ValidationFailureType.MIN_LENGTH))({num: minlength});
          }

          return this.promiseUtils_.reject(failureMessage);
        }
      }

      return null;
    }

    private validateFieldRequired_(value:any, validationRules:ValidationRules):any {
      if (validationRules.required) {
        var required:boolean = angular.isObject(validationRules.required) ?
          (<ValidationRuleBoolean> validationRules.required).rule :
          <boolean> validationRules.required;

        if (angular.isString(value)) {
          value = value.replace(/\s+$/, ''); // Disallow an all-whitespace string
        }

        if (required && !value) {
          var failureMessage:string;

          if (angular.isObject(validationRules.required)) {
            failureMessage = (<ValidationRuleBoolean> validationRules.required).message;
          } else {
            failureMessage =
              this.formForConfiguration_.getFailedValidationMessage(
                ValidationFailureType.REQUIRED);
          }

          return this.promiseUtils_.reject(failureMessage);
        }
      }

      return null;
    }

    private validateFieldPattern_(value:any, validationRules:ValidationRules):any {
      if (validationRules.pattern) {
        var isRegExp:boolean = validationRules.pattern instanceof RegExp;
        var regExp:RegExp = isRegExp ?
          <RegExp> validationRules.pattern :
          (<ValidationRuleRegExp> validationRules.pattern).rule;

        if (!regExp.exec(value)) {
          var failureMessage:string = isRegExp ?
            this.formForConfiguration_.getFailedValidationMessage(ValidationFailureType.PATTERN) :
            (<ValidationRuleRegExp> validationRules.pattern).message;

          return this.promiseUtils_.reject(failureMessage);
        }
      }

      return null;
    }

    private validateFieldType_(value:any, validationRules:ValidationRules):any {
      if (validationRules.type) {
        // String containing 0+ ValidationRuleFieldType enums
        var typesString:any = angular.isObject(validationRules.type) ?
          (<ValidationRuleFieldType> validationRules.type).rule :
          validationRules.type;

        var stringValue:string = value.toString();
        var numericValue:number = Number(value);

        if (typesString) {
          var types:Array<ValidationFieldType> = typesString.split(' ');

          for (var i:number = 0, length:number = types.length; i < length; i++) {
            var type:ValidationFieldType = types[i];

            switch (type) {
              case ValidationFieldType.INTEGER:
                if (stringValue && (isNaN(numericValue) || numericValue % 1 !== 0)) {
                  return this.promiseUtils_.reject(
                    this.getFieldTypeFailureMessage_(validationRules, ValidationFailureType.TYPE_INTEGER));
                }
                break;

              case ValidationFieldType.NUMBER:
                if (stringValue && isNaN(numericValue)) {
                  return this.promiseUtils_.reject(
                    this.getFieldTypeFailureMessage_(validationRules, ValidationFailureType.TYPE_NUMERIC));
                }
                break;

              case ValidationFieldType.NEGATIVE:
                if (ModelValidator.isConsideredNumeric_(stringValue, numericValue) && numericValue >= 0) {
                  return this.promiseUtils_.reject(
                    this.getFieldTypeFailureMessage_(validationRules, ValidationFailureType.TYPE_NEGATIVE));
                }
                break;

              case ValidationFieldType.NON_NEGATIVE:
                if (ModelValidator.isConsideredNumeric_(stringValue, numericValue) && numericValue < 0) {
                  return this.promiseUtils_.reject(
                    this.getFieldTypeFailureMessage_(validationRules, ValidationFailureType.TYPE_NON_NEGATIVE));
                }
                break;

              case ValidationFieldType.POSITIVE:
                if (ModelValidator.isConsideredNumeric_(stringValue, numericValue) && numericValue <= 0) {
                  return this.promiseUtils_.reject(
                    this.getFieldTypeFailureMessage_(validationRules, ValidationFailureType.TYPE_POSITIVE));
                }
                break;

              case ValidationFieldType.EMAIL:
                if (stringValue && !stringValue.match(/^.+@.+$/)) {
                  return this.promiseUtils_.reject(
                    this.getFieldTypeFailureMessage_(validationRules, ValidationFailureType.TYPE_EMAIL));
                }
                break;
            }
          }
        }
      }

      return null;
    }
  }

  angular.module('formFor').service('ModelValidator',
    ($interpolate, $parse, $q, FormForConfiguration) =>
      new ModelValidator($interpolate, $parse, $q, FormForConfiguration));
}