angular.module("formFor.materialTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("form-for/templates/checkbox-field.html","<md-checkbox md-no-ink\n             class=\"md-primary\"\n             aria-label=\"{{label}}\"\n             ng-disabled=\"disable || model.disabled\"\n             ng-model=\"model.bindable\">\n\n  {{label}}\n\n  <field-label  ng-if=\"label\"\n                input-uid=\"{{model.uid}}\"\n                iud=\"{{model.uid}}-label\"\n                label=\"{{label}}\"\n                help=\"{{help}}\"\n                required=\"{{model.required}}\">\n  </field-label>\n\n  <field-error  error=\"model.error\"\n                left-aligned=\"true\"\n                uid=\"{{model.uid}}-error\">\n  </field-error>\n</md-checkbox>");
$templateCache.put("form-for/templates/collection-label.html","<div>\n    <field-label  ng-if=\"label\"\n                  label=\"{{label}}\"\n                  help=\"{{help}}\"\n                  required=\"{{model.required}}\">\n    </field-label>\n\n    <small ng-if=\"model.error\" class=\"text-danger\" ng-bind=\"model.error\"></small>\n</div>\n");
$templateCache.put("form-for/templates/field-error.html","<div  ng-if=\"error\"\n      id=\"{{uid}}\"\n      class=\"text-danger\"\n      ng-bind=\"error\"\n      ng-message>\n</div>\n");
$templateCache.put("form-for/templates/field-label.html","<label ng-bind=\"label\">\n  <md-tooltip ng-if=\"help\">{{help}}</md-tooltip>\n</label>");
$templateCache.put("form-for/templates/radio-field.html","<md-radio-group ng-model=\"model.bindable\">\n  <field-label  ng-if=\"label\"\n                input-uid=\"{{model.uid}}\"\n                iud=\"{{model.uid}}-label\"\n                label=\"{{label}}\"\n                help=\"{{help}}\"\n                required=\"{{model.required}}\">\n  </field-label>\n\n  <md-radio-button ng-repeat=\"option in options\"\n                   ng-disabled=\"disable || model.disabled\"\n                   ng-value=\"option[valueAttribute]\"\n                   tabindex=\"{{tabIndex}}\">\n      {{option[labelAttribute]}}\n  </md-radio-button>\n\n  <field-error  ng-if=\"!hideErrorMessage\"\n                error=\"model.error\"\n                uid=\"{{uid}}-error\">\n  </field-error>\n</md-radio-group>");
$templateCache.put("form-for/templates/select-field.html","<div>\n    <span ng-if=\"enableFiltering\"\n          ng-include form-for-include-replace\n          src=\"\'form-for/templates/select-field/_filtered-select.html\'\"></span>\n\n    <span ng-if=\"!enableFiltering && multiple\"\n          ng-include form-for-include-replace\n          src=\"\'form-for/templates/select-field/_multi-select.html\'\"></span>\n\n    <span ng-if=\"!enableFiltering && !multiple\"\n          ng-include form-for-include-replace\n          src=\"\'form-for/templates/select-field/_select.html\'\"></span>\n\n  <field-error  error=\"model.error\"\n                uid=\"{{model.uid}}-error\">\n  </field-error>\n</div>");
$templateCache.put("form-for/templates/submit-button.html","<md-button tabindex=\"{{tabIndex}}\"\n           ng-bind-html=\"bindableLabel\"\n           ng-disabled=\"disable || model.disabled\">\n</md-button>");
$templateCache.put("form-for/templates/text-field.html","<md-input-container>\n    <field-label  ng-if=\"label\"\n                  input-uid=\"{{model.uid}}\"\n                  iud=\"{{model.uid}}-label\"\n                  label=\"{{label}}\"\n                  help=\"{{help}}\"\n                  required=\"{{model.required}}\">\n    </field-label>\n\n    <!-- <input> and <textarea> rendered as partials to allow for easier overrides -->\n    <span ng-if=\"!multiline\"\n          ng-include form-for-include-replace\n          src=\"\'form-for/templates/text-field/_input.html\'\"></span>\n    <span ng-if=\"multiline\"\n          ng-include form-for-include-replace\n          src=\"\'form-for/templates/text-field/_textarea.html\'\"></span>\n\n    <field-error ng-messages\n                 uid=\"{{model.uid}}-error\"\n                 error=\"model.error\"></field-error>\n</md-input-container>");
$templateCache.put("form-for/templates/select-field/_filtered-select.html","<md-autocomplete\n        ng-disabled=\"disable || model.disabled\"\n        md-selected-item=\"scopeBuster.selectedOption\"\n        md-search-text=\"scopeBuster.filter\"\n        md-items=\"option in filteredOptions\"\n        md-item-text=\"option[labelAttribute]\"\n        md-selected-item-change=\"selectOption(option)\"\n        md-floating-label=\"{{label}}\"\n        placeholder=\"{{scopeBuster.filter || placeholder}}\">\n\n    <span md-highlight-text=\"scopeBuster.filter\">{{option[labelAttribute]}}</span>\n</md-autocomplete>");
$templateCache.put("form-for/templates/select-field/_multi-select.html","<div>\n  <div ng-if=\"label\" class=\"md-caption\">\n    {{label}}\n  </div>\n\n  <md-select ng-model=\"model.bindable\"\n             ng-disabled=\"disable || model.disabled\"\n             multiple=\"true\">\n      <md-select-label>{{selectedOptionLabel || placeholder}}</md-select-label>\n      <md-option ng-repeat=\"option in filteredOptions\"\n                 ng-value=\"option[valueAttribute]\">\n          {{option[labelAttribute]}}\n      </md-option>\n  </md-select>\n</div>");
$templateCache.put("form-for/templates/select-field/_select.html","<div>\n  <div ng-if=\"label\" class=\"md-caption\">\n    {{label}}\n  </div>\n\n  <md-select ng-model=\"model.bindable\"\n             ng-disabled=\"disable || model.disabled\">\n    <md-select-label>{{selectedOptionLabel || placeholder}}</md-select-label>\n    <md-option ng-repeat=\"option in filteredOptions\"\n               ng-value=\"option[valueAttribute]\">\n      {{option[labelAttribute]}}\n    </md-option>\n  </md-select>\n</div>");
$templateCache.put("form-for/templates/text-field/_input.html","<input  aria-manager\n        id=\"{{model.uid}}\"\n        type=\"{{type}}\"\n        tabindex=\"{{tabIndex}}\"\n        data-placeholder=\"{{placeholder}}\"\n        ng-model=\"model.bindable\"\n        ng-disabled=\"disable || model.disabled\"\n        ng-click=\"onFocus()\"\n        ng-blur=\"onBlur()\" />");
$templateCache.put("form-for/templates/text-field/_textarea.html","<textarea aria-manager\n          id=\"{{model.uid}}\"\n          class=\"form-control\"\n          ng-disabled=\"disable || model.disabled\"\n          tabindex=\"{{tabIndex}}\"\n          data-placeholder=\"{{placeholder}}\"\n          rows=\"{{rows}}\"\n          ng-model=\"model.bindable\"\n          ng-click=\"onFocus()\"\n          ng-blur=\"onBlur()\">\n</textarea>");}]);