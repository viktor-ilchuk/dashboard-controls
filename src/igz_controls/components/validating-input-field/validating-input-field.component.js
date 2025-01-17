/*
Copyright 2018 Iguazio Systems Ltd.
Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.
In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
(function () {
    'use strict';

    /**
     * @name igzValidatingInputField
     * @component
     *
     * @description
     * An input field that wraps around regular `<input>` or `<textarea>` elements and enriches them with validation
     * capabilities. Validation rules could be provided to display a menu of validation rules to the user on demand, and
     * mark which of them passes and which fails. The field is styled according to its validity.
     *
     * @param {string} [bordersMode='always'] - Determines when to show borders. Could be one of:
     *     - `'always'` (default): always show borders (like a regular input field)
     *     - `'hover'`: hide borders when idle (unless placeholder is shown), show them on hover (and on focus)
     *     - `'focus'`: hide borders when idle (unless placeholder is shown) and on hover, show them only on focus
     *     Note: this attribute is ignored when `readOnly` attribute is set to `true`.
     * @param {string} [compareInputValue] - If provided, the input will be valid if it matches this, or otherwise it
     *     will be invalid.
     * @param {string} [fieldType='input'] - Determines the type of field:
     *     - `'input'` (default): a text box
     *     - `'password'`: a text box with concealed characters
     *     - `'textarea'`: a multi-line text-area
     *     - `'schedule'`: a mix of multiple drop-down menu fields to conveniently create a recurring schedule
     *                     (generating a CRON string @see {@link https://crontab.guru/})
     * @param {Object} [formObject] - The `<form>` or `<ng-form>` element/directive containing this input field.
     * @param {boolean} [hideCounter=false] - Set to `true` to hide the remaining characters counter when
     *     `validationMaxLength` is used.
     * @param {Object} [inputModelOptions] - A `ngModelOptions` object to forward to `ng-model-options` attribute of
     *     the HTML `<input>` or `<textarea>` element. Some options may be ignored/overridden by this component to make
     *     some of its features work properly.
     * @param {string} inputName - The name of the filed, will be forwarded to the `name` attribute of the HTML
     *     `<input>` element.
     * @param {*} inputValue - The initial value of the field. This is a one-way binding that is watched for changes.
     * @param {function} [itemBlurCallback] - A callback function for `blur` event. Invoked with `inputValue` and
     *     `inputName` when the field loses focus. Note that when `is-data-revert` attribute is `false` and blur event
     *     happened prior to `ngChange` invocation (could happen with debounced or future events via `ngModelOptions`)
     *     then the value of `inputValue` might not reflect the up-to-date _view_ value, but the _model_ value (which
     *     might be different in this case).
     * @param {function} [itemFocusCallback] - A callback function for `focus` event. Invoked with `inputName` when the
     *     field becomes focused.
     * @param {boolean} [isDataRevert=false] - Set to `true` to revert to last valid value on losing focus. This will
     *     invoke `updateDataCallback` on `blur` event in case the value was successfully changed, and will not invoke
     *     it in case the value was reverted. `itemBlurCallback` will be invoked on `blur` event regardless.
     * @param {boolean} [isDisabled=false] - Set to `true` to make this field disabled.
     * @param {boolean} [isFocused=false] - Set to `true` to give focus to this field once it finished initializing.
     *     This is a one-way binding that is watched for changes.
     * @param {string} [tabindex=0] - Indicates where the field participates in sequential keyboard navigation.
     *     Forwarded to the `tabindex` attribute of the HTML element.
     * @param {{text: string, placement: string, delay: number}} [tooltip] - Allows a tooltip hint to open when hovering
     *     the input field. This is useful for not setting a tooltip on the entire `<igz-validating-input-field>`
     *     component, which includes the validation rule pop-over too, and it is not desired to show the tooltip when
     *     hovering on that pop-over, but only when hovering the input field itself.
     * @param {boolean} [trim=true] - Set to `false` to prevent automatic removal of leading and trailing spaces from
     *     entered value.
     * @param {boolean} [onlyValidCharacters=false] - Set to `true` to allow only characters that match the RegExp
     *     pattern passed in `validation-pattern` attribute.
     * @param {string} [placeholderText] - Placeholder text to display when input is empty.
     * @param {boolean} [readOnly=false] - Set to `true` to make this field read-only. If `true`, ignores `borderMode`.
     * @param {boolean} [spellcheck=true] - Set to `false` to disable spell-check to this field (for example when the
     *     value of s Base64 string which clearly does not need spell checking).
     * @param {function} [updateDataCallback] - A callback function for value changes. Invoked with `newData` and
     *     `field`. When `isDataRevert` is set to `true` this function will be invoked on `blur` event.
     * @param {string} [updateDataField=inputName] - The field name to be passed as `field` parameter when invoking
     *     `updateDataCallback` (defaults to `inputName`'s value).
     * @param {boolean} [validationIsRequired=false] - Set to `true` to make this field mandatory. The field will be
     *     invalid if it is empty.
     * @param {string} [validationMaxLength] - Maximum length for this field's input (will add a counter of remaining
     *     characters, unless `hideCounter` is set to `true`). The field will be invalid if its value is longer.
     * @param {string} [validationPattern] - Regex pattern to test the field's input. The field will be invalid if the
     *     value does not match the pattern.
     * @param {boolean} [autoComplete='off'] - A hint to the web browser's auto-fill feature. Forwarded to the
     *     `autocomplete` attribute of HTML `<input>` element.
     * @param {function} [enterCallback] - A callback function for the `keydown` event when the Enter key is down.
     *     Invoked without parameters.
     * @param {string} [inputIcon] - A CSS class name to use for displaying an icon inside the box before the input.
     * @param {boolean} [isClearIcon=false] - Set to `true` to display a "Clear" action icon for emptying the input.
     * @param {Array} [validationRules] - A list of validation rules to check against as input changes. The field will
     *     be invalid if the input does not match any of the rules.
     * @param {string} validationRules[].label - The text to display as the description of the rule. For example:
     *     "Must begin with: A-Z, a-z, 0-9, -".
     * @param {RegExp|function} validationRules[].pattern - The regex pattern to test input against, or a function that
     *     should return `true` in case rule is valid or `false` otherwise. The function will be invoked with the
     *     current input value, the input field name and the `ngForm` (if provided to `formObject` attribute).
     * @param {string} [validationRules[].name] - A unique name for the rule among the list.
     */
    angular.module('iguazio.dashboard-controls')
        .component('igzValidatingInputField', {
            bindings: {
                autoComplete: '@?',
                bordersMode: '@?',
                compareInputValue: '<?',
                enterCallback: '&?',
                fieldType: '@?',
                formObject: '<?',
                hideCounter: '<?',
                inputIcon: '@',
                inputModelOptions: '<?',
                inputName: '@',
                inputValue: '<',
                isClearIcon: '<?',
                isDataRevert: '<?',
                isDisabled: '<?',
                isFocused: '<?',
                itemBlurCallback: '&?',
                itemFocusCallback: '&?',
                onlyValidCharacters: '<?',
                placeholderText: '@',
                readOnly: '<?',
                spellcheck: '<?',
                tabindex: '@?',
                tooltip: '<?',
                trim: '<?',
                updateDataCallback: '&?',
                updateDataField: '@?',
                validationIsRequired: '<?',
                validationMaxLength: '@?',
                validationPattern: '<?',
                validationRules: '<*?'
            },
            templateUrl: 'igz_controls/components/validating-input-field/validating-input-field.tpl.html',
            controller: IgzValidatingInputFieldController
        });

    function IgzValidatingInputFieldController($document, $element, $scope, $timeout, $window, lodash,
                                               EventHelperService) {
        var ctrl = this;

        var BORDER_MODES = {
            ALWAYS: 'always',
            HOVER: 'hover',
            FOCUS: 'focus'
        };
        var FIELD_TYPES = {
            INPUT: 'input',
            PASSWORD: 'password',
            TEXTAREA: 'textarea',
            SCHEDULE: 'schedule'
        };
        var BORDERS_CLASS_BASE = 'borders-';
        var defaultBorderMode = BORDER_MODES.ALWAYS;
        var defaultInputModelOptions = {
            updateOn: 'default blur',
            debounce: {
                'default': 250,
                '*': 0
            },
            allowInvalid: true
        };
        var fieldElement = {};
        var lastValidValue = '';
        var ngModel = null;

        ctrl.bordersModeClass = '';
        ctrl.data = '';
        ctrl.inputFocused = false;
        ctrl.inputIsTouched = false;
        ctrl.isValidationPopUpShown = false;
        ctrl.preventInputBlur = false;
        ctrl.selectedFieldType = FIELD_TYPES.INPUT;
        ctrl.showPopUpOnTop = false;

        ctrl.$onInit = onInit;
        ctrl.$postLink = postLink;
        ctrl.$onChanges = onChanges;
        ctrl.$onDestroy = onDestroy;

        ctrl.clearInputField = clearInputField;
        ctrl.getRemainingCharactersCount = getRemainingCharactersCount;
        ctrl.hasInvalidRule = hasInvalidRule;
        ctrl.isCounterVisible = isCounterVisible;
        ctrl.isFieldInvalid = isFieldInvalid;
        ctrl.onBlur = onBlur;
        ctrl.onChange = onChange;
        ctrl.onFocus = onFocus;
        ctrl.onKeyDown = onKeyDown;
        ctrl.toggleValidationPopUp = toggleValidationPopUp;

        //
        // Hook methods
        //

        /**
         * Initialization method
         */
        function onInit() {
            // set default values for optional component attributes (`<?`, `@?`, `&?`) that are not updated when the
            // scope expression changes (those that change get default values in `$onChanges` lifecycle hook)
            lodash.defaults(ctrl, {
                autoComplete: 'off',
                bordersMode: defaultBorderMode,
                enterCallback: angular.noop,
                fieldType: ctrl.selectedFieldType,
                hideCounter: false,
                inputModelOptions: {},
                isClearIcon: false,
                isDataRevert: false,
                isDisabled: false,
                itemBlurCallback: angular.noop,
                itemFocusCallback: angular.noop,
                onlyValidCharacters: false,
                readOnly: false,
                spellcheck: true,
                tabindex: '0',
                tooltip: {
                    text: '',
                    placement: 'auto',
                    duration: '200'
                },
                trim: true,
                updateDataCallback: angular.noop,
                updateDataField: ctrl.inputName,
                validationIsRequired: false
            });

            // if provided `fieldType` attribute is one of the available values, assign it
            // otherwise `ctrl.selectedFieldType` will remain set to the default value
            if (lodash.includes(FIELD_TYPES, ctrl.fieldType)) {
                ctrl.selectedFieldType = ctrl.fieldType;
            }

            // if provided `bordersMode` attribute is not one of the available values, set it to a default
            if (!lodash.includes(BORDER_MODES, ctrl.bordersMode)) {
                ctrl.bordersMode = defaultBorderMode;
            }
            ctrl.bordersModeClass = BORDERS_CLASS_BASE + ctrl.bordersMode;

            lodash.defaultsDeep(ctrl.inputModelOptions, defaultInputModelOptions);
        }

        /**
         * Post linking method
         */
        function postLink() {
            $scope.$applyAsync(function () {
                fieldElement = $element.find('.field');
                ngModel = fieldElement.controller('ngModel');

                ngModel.$validators.validationRules = function (modelValue) {
                    if (!ctrl.validationIsRequired && ctrl.data === '') {
                        resetPatternsValidity();
                        return true;
                    } else {
                        return checkPatternsValidity(modelValue);
                    }
                };

                // validate on init in case the input field starts with an invalid value
                // important for cases when for example you have an invalid field due to failed rule and then switch to
                // another tab and back to the failed field, it might be re-initialized, but we want it to be displayed
                // with the "failed validation rule" icon
                ngModel.$validate();

                // set focus to the input field in case `is-focused` attribute is `true`
                // if the input field is inside a dialog, await the dialog's animation
                if (ctrl.isFocused) {
                    var timer = $element.closest('.ngdialog').length > 0 ? 300 : 0;

                    $timeout(function () {
                        fieldElement.focus();
                    }, timer);
                }
            });
        }

        /**
         * On changes hook method.
         * @param {Object} changes
         */
        function onChanges(changes) {
            if (angular.isDefined(changes.inputValue)) {
                ctrl.data = lodash.defaultTo(changes.inputValue.currentValue, '');

                // update `lastValidValue` to later use it on `blur` event in case `is-data-revert` attribute is `true`
                // and the input field is invalid (so the input field could be reverted to the last valid value)
                lastValidValue = angular.copy(ctrl.data);
            }

            if (angular.isDefined(changes.isFocused)) {
                ctrl.inputFocused = lodash.defaultTo(changes.isFocused.currentValue, false);
                if (!changes.isFocused.isFirstChange()) {
                    $timeout(function () {
                        fieldElement.focus();
                    });
                }
            }

            if (angular.isDefined(changes.validationRules)) {
                ctrl.validationRules = angular.copy(lodash.defaultTo(changes.validationRules.currentValue, []));

                if (ctrl.data !== '' && !changes.validationRules.isFirstChange()) {
                    ngModel.$validate();
                }
            }
        }

        /**
         * Destructor
         */
        function onDestroy() {
            angular.element($window).off('animationend');
            $document.off('click', handleDocumentClick);
        }

        //
        // Public methods
        //

        /**
         * Clears search input field.
         */
        function clearInputField() {
            if (ctrl.selectedFieldType === 'schedule') {
                ngModel.$setViewValue('');
                ngModel.$commitViewValue();
            } else {
                ctrl.data = '';
                onChange();
            }
        }

        /**
         * Gets count of the remaining characters for the field.
         * @returns {number} count of the remaining characters for the field.
         */
        function getRemainingCharactersCount() {
            var maxLength = Number.parseInt(ctrl.validationMaxLength);
            var currentLength = ctrl.data.length;

            return maxLength <= 0 ? null : (maxLength - currentLength).toString();
        }

        /**
         * Checks whether there is at least one failed validation rule.
         * @returns {boolean} `true` in case there is at least one failed validation rule, or `false` otherwise.
         */
        function hasInvalidRule() {
            return lodash.some(ctrl.validationRules, ['isValid', false]);
        }

        /**
         * Checks whether the counter should be visible.
         * @returns {boolean} `true` in case the counter should be visible, or `false` otherwise.
         */
        function isCounterVisible() {
            return !ctrl.isDisabled && !ctrl.onlyValidCharacters && !ctrl.hideCounter && !ctrl.readOnly &&
                !lodash.isNil(ctrl.validationMaxLength);
        }

        /**
         * Checks whether the field is invalid.
         * Do not validate field if `onlyValidCharacters` component attribute was passed.
         * @returns {boolean} `true` in case the field is valid, or `false` otherwise.
         */
        function isFieldInvalid() {
            return ctrl.onlyValidCharacters ? false :
                (lodash.get(ctrl.formObject, '$submitted') || lodash.get(ngModel, '$dirty')) &&
                    lodash.get(ngModel, '$invalid');
        }

        /**
         * Loses focus from input field.
         * @param {FocusEvent} event - the `blur` event object.
         */
        function onBlur(event) {
            if (ctrl.preventInputBlur) {
                ctrl.preventInputBlur = false;
                ctrl.inputFocused = true;
                event.target.focus();
            } else {
                ctrl.inputFocused = false;

                // in case model update is debounced using `ngModelOptions`, this means `$viewValue` and `$modelValue`
                // might be different at this point (for example, when blur event happened prior to `ngChange`
                // invocation). before proceeding with the logic hereafter we must make sure to commit the current
                // view-value, so the model-value gets updated accordingly, and the field also gets validated (meaning
                // `$valid` and `$invalid` are up-to-date). If the above case is true, this will also trigger `ngChange`
                // for the input.
                ngModel.$commitViewValue();

                // in case `is-data-revert` attribute is `true` - set or revert outer model value
                if (ctrl.isDataRevert) {
                    setOrRevertInputValue();
                }

                ctrl.itemBlurCallback({
                    event: event,
                    inputValue: ctrl.data,
                    inputName: ctrl.inputName
                });
            }
        }

        /**
         * Updates outer model value on inner model value change.
         */
        function onChange() {
            ngModel.$validate();
            if (ctrl.isDataRevert) {
                if (ngModel.$valid) {
                    // update `lastValidValue` to later use it on `blur` event in case `is-data-revert` attribute is
                    // `true` and the input field is invalid (so the input field could be reverted to the last valid
                    // value)
                    lastValidValue = ctrl.data;
                }
            } else {
                ctrl.updateDataCallback({
                    newData: ctrl.data,
                    field: ctrl.updateDataField
                });
            }
        }

        /**
         * Puts focus on input field.
         * @param {Event} event - The `focus` event object.
         */
        function onFocus(event) {
            ctrl.inputFocused = true;

            if (!lodash.isEmpty(ctrl.validationRules)) {
                ctrl.inputIsTouched = true;
            }

            ctrl.itemFocusCallback({
                event: event,
                inputValue: ctrl.data,
                inputName: ctrl.inputName
            });
        }

        /**
         * Handles the 'keyDown' event.
         * @param {Event} event - The `keydown` event object.
         */
        function onKeyDown(event) {
            if (event.keyCode === EventHelperService.ENTER) {
                $timeout(ctrl.enterCallback);
            }
        }

        /**
         * Shows/hides the validation pop up.
         */
        function toggleValidationPopUp() {
            if (!lodash.isEmpty(ctrl.validationRules)) {
                var popUp = $element.find('.validation-pop-up');
                ctrl.isValidationPopUpShown = !ctrl.isValidationPopUpShown;

                if (ctrl.isValidationPopUpShown) {
                    $document.on('click', handleDocumentClick);

                    // in order for the calculation in the function of `$timeout` below to work, the pop up should first
                    // be positioned downwards, then it will determine whether it does not have enough room there and
                    // will move it upwards in that case.
                    ctrl.showPopUpOnTop = false;

                    $timeout(function () {
                        fieldElement.focus();
                        ctrl.inputFocused = true;
                        ctrl.showPopUpOnTop = $window.innerHeight - popUp.offset().top - popUp.outerHeight() < 0;
                    });
                } else {
                    $document.off('click', handleDocumentClick);
                }
            }
        }

        //
        // Private methods
        //

        /**
         * Checks and sets validity based on `ctrl.validationRules`
         * @param {string} value - current input value
         */
        function checkPatternsValidity(value) {
            lodash.forEach(ctrl.validationRules, function (rule) {
                rule.isValid = lodash.isFunction(rule.pattern) ? rule.pattern(value, ctrl.inputName, ctrl.formObject) :
                               /* else, it is a RegExp */        rule.pattern.test(value);
            });

            return !hasInvalidRule();
        }

        /**
         * Handles click on validation icon and show/hide validation pop-up.
         * @param {Event} event - The `click` event.
         */
        function handleDocumentClick(event) {
            if ($element.find(event.target).length === 0) {
                ctrl.isValidationPopUpShown = false;
            }

            if (!ctrl.isValidationPopUpShown) {
                $document.off('click', handleDocumentClick);
            }
        }

        /**
         * Sets all validation rules to be valid
         */
        function resetPatternsValidity() {
            lodash.forEach(ctrl.validationRules, function (rule) {
                rule.isValid = true;
            });
        }

        /**
         * Sets or reverts outer model value
         */
        function setOrRevertInputValue() {
            // if the input value is invalid - revert it to the last valid value
            // otherwise, notify the parent about the value change
            if (ngModel.$invalid) {
                ctrl.data = lastValidValue;
            } else {
                ctrl.updateDataCallback({
                    newData: ctrl.data,
                    field: ctrl.updateDataField
                });
            }
        }
    }
}());
