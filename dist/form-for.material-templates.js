angular.module("formFor.materialTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("form-for/templates/checkbox-field.html","<md-checkbox class=\"md-primary\"\n             aria-label=\"{{label}}\"\n             ng-disabled=\"disable || model.disabled\"\n             ng-model=\"model.bindable\">\n\n  <field-label  ng-if=\"label\"\n                input-uid=\"{{model.uid}}\"\n                iud=\"{{model.uid}}-label\"\n                label=\"{{label}}\"\n                help=\"{{help}}\"\n                required=\"{{model.required}}\">\n  </field-label>\n\n  <field-error  error=\"model.error\"\n                left-aligned=\"true\"\n                uid=\"{{model.uid}}-error\">\n  </field-error>\n</md-checkbox>");
$templateCache.put("form-for/templates/collection-label.html","<div>\n    <field-label  ng-if=\"label\"\n                  label=\"{{label}}\"\n                  help=\"{{help}}\"\n                  required=\"{{model.required}}\">\n    </field-label>\n\n    <small ng-if=\"model.error\" class=\"text-danger\" ng-bind=\"model.error\"></small>\n</div>\n");
$templateCache.put("form-for/templates/field-error.html","<div  ng-if=\"error\"\n      id=\"{{uid}}\"\n      class=\"text-danger\"\n      ng-bind=\"error\"\n      ng-message>\n</div>\n");
$templateCache.put("form-for/templates/field-label.html","<label ng-bind=\"label\">\n  <md-tooltip ng-if=\"help\"\n              md-direction=\"{{attributes.direction || \'right\'}}\">\n    {{help}}\n  </md-tooltip>\n</label>");
$templateCache.put("form-for/templates/radio-field.html","<md-radio-group ng-model=\"model.bindable\">\n  <field-label  ng-if=\"label\"\n                input-uid=\"{{model.uid}}\"\n                iud=\"{{model.uid}}-label\"\n                label=\"{{label}}\"\n                help=\"{{help}}\"\n                required=\"{{model.required}}\">\n  </field-label>\n\n  <md-radio-button ng-repeat=\"option in options\"\n                   ng-disabled=\"disable || model.disabled\"\n                   ng-value=\"option[valueAttribute]\"\n                   tabindex=\"{{tabIndex}}\">\n      {{option[labelAttribute]}}\n  </md-radio-button>\n\n  <field-error  ng-if=\"!hideErrorMessage\"\n                error=\"model.error\"\n                uid=\"{{uid}}-error\">\n  </field-error>\n</md-radio-group>");
$templateCache.put("form-for/templates/select-field.html","<span>\n  <span ng-if=\"multiple\"\n        ng-include\n        src=\"\'form-for/templates/select-field/_multi-select.html\'\">\n  </span>\n\n  <span ng-if=\"!multiple\"\n        ng-include\n        src=\"\'form-for/templates/select-field/_select.html\'\">\n  </span>\n\n  <field-error  error=\"model.error\"\n                uid=\"{{model.uid}}-error\">\n  </field-error>\n</span>");
$templateCache.put("form-for/templates/submit-button.html","<md-button tabindex=\"{{tabIndex}}\"\n           ng-bind-html=\"bindableLabel\"\n           aria-label=\"bindableLabel\"\n           ng-disabled=\"disable || model.disabled\">\n</md-button>");
$templateCache.put("form-for/templates/text-field.html","<md-input-container>\n    <field-label  ng-if=\"label\"\n                  input-uid=\"{{model.uid}}\"\n                  iud=\"{{model.uid}}-label\"\n                  label=\"{{label}}\"\n                  help=\"{{help}}\"\n                  direction=\"bottom\"\n                  required=\"{{model.required}}\">\n    </field-label>\n\n    <!-- <input> and <textarea> rendered as partials to allow for easier overrides -->\n    <span ng-if=\"!multiline\"\n          ng-include\n          src=\"\'form-for/templates/text-field/_input.html\'\"></span>\n    <span ng-if=\"multiline\"\n          ng-include\n          src=\"\'form-for/templates/text-field/_textarea.html\'\"></span>\n\n    <field-error ng-messages\n                 uid=\"{{model.uid}}-error\"\n                 error=\"model.error\"></field-error>\n</md-input-container>");
$templateCache.put("form-for/templates/type-ahead-field.html","<span>\n  <field-label  ng-if=\"label\"\n                input-uid=\"{{model.uid}}\"\n                iud=\"{{model.uid}}-label\"\n                label=\"{{label}}\"\n                help=\"{{help}}\"\n                required=\"{{model.required}}\">\n  </field-label>\n\n  <md-autocomplete\n      ng-disabled=\"disable || model.disabled\"\n      md-selected-item=\"selectedOption\"\n      md-search-text=\"scopeBuster.filter\"\n      md-search-text-change=\"searchTextChange(scopeBuster.filter)\"\n      md-selected-item-change=\"selectOption(item)\"\n      md-items=\"item in filteredOptions\"\n      md-item-text=\"item.label\"\n      placeholder=\"{{placeholder}}\">\n\n    <md-item-template>\n      <span md-highlight-text=\"scopeBuster.filter\">\n        {{item.label}}\n      </span>\n    </md-item-template>\n\n    <md-not-found>\n      No matches found for \"{{scopeBuster.filter}}\".\n    </md-not-found>\n  </md-autocomplete>\n\n  <field-error  error=\"model.error\"\n                uid=\"{{model.uid}}-error\">\n  </field-error>\n</span>");
$templateCache.put("form-for/templates/select-field/_multi-select.html","<span>\n  <div ng-if=\"label\" class=\"md-caption\">\n    {{label}}\n\n    <md-tooltip ng-if=\"help\" md-direction=\"right\">{{help}}</md-tooltip>\n  </div>\n\n  <md-select ng-model=\"model.bindable\"\n             ng-disabled=\"disable || model.disabled\"\n             placeholder=\"{{placeholder}}\"\n             md-autoselect=\"!preventDefaultOption\"\n             multiple>\n\n    <md-option ng-repeat=\"option in bindableOptions\"\n               ng-value=\"{{option.value}}\">\n      {{option.label}}\n    </md-option>\n  </md-select>\n</span>");
$templateCache.put("form-for/templates/select-field/_select.html","<span>\n  <div ng-if=\"label\" class=\"md-caption\">\n    {{label}}\n\n    <md-tooltip ng-if=\"help\" md-direction=\"right\">{{help}}</md-tooltip>\n  </div>\n\n  <md-select ng-model=\"model.bindable\"\n             ng-disabled=\"disable || model.disabled\"\n             placeholder=\"{{placeholder}}\"\n             md-autoselect=\"!preventDefaultOption\">\n\n    <md-option ng-repeat=\"option in bindableOptions\"\n               ng-value=\"option.value\">\n      {{option.label}}\n    </md-option>\n  </md-select>\n</span>");
$templateCache.put("form-for/templates/text-field/_input.html","<input  aria-manager\n        id=\"{{model.uid}}\"\n        name=\"{{attribute}}\"\n        type=\"{{type}}\"\n        tabindex=\"{{tabIndex}}\"\n        data-placeholder=\"{{placeholder}}\"\n        ng-model=\"model.bindable\"\n        ng-disabled=\"disable || model.disabled\"\n        ng-click=\"onFocus()\"\n        ng-blur=\"onBlur()\" />");
$templateCache.put("form-for/templates/text-field/_textarea.html","<textarea aria-manager\n          id=\"{{model.uid}}\"\n          name=\"{{attribute}}\"\n          class=\"form-control\"\n          ng-disabled=\"disable || model.disabled\"\n          tabindex=\"{{tabIndex}}\"\n          data-placeholder=\"{{placeholder}}\"\n          rows=\"{{rows}}\"\n          ng-model=\"model.bindable\"\n          ng-click=\"onFocus()\"\n          ng-blur=\"onBlur()\">\n</textarea>");}]);