/* jshint devel:true */
(function () {

    function AppController($scope, $log, $timeout, $http) {
        var vm = this;
        // var streamdata;
        vm.tab = 1;
        vm.isPatching = false;
        vm.limitNbPatch = 10000;
        vm.headers = [];

        this.popupPk = {
            content: 'An application token is required for authentication. <a href="https://portal.streamdata.io/#/register" target="_blank">Sign Up</a> to get yours.',
            options: {
                title: null,
                placement: 'left',
                html: true,
                delay: {show: 0, hide: 1500}
            }
        };
        this.popupHeaders = {
            content: 'Add any custom HTTP Header (optional)',
            options: {
                title: null,
                placement: 'right',
                html: false,
                delay: {show: 0, hide: 0}
            }
        };
        this.popupSignature = {
            content: 'Sign your request with your application private key.',
            options: {
                title: null,
                placement: 'right',
                html: false,
                delay: {show: 0, hide: 0}
            }
        };
        vm.init = function () {
            vm.urls = '';
            vm.url = '';
            $scope.urlList =  [
              {
                name: 'Stackoverflow',
                url: 'https://api.stackexchange.com/2.2/answers?order=desc&sort=activity&site=stackoverflow'
              },
              {
                name: 'Xignite',
                url: 'https://globalcurrencies.xignite.com/xGlobalCurrencies.json/GetRealTimeRates?Symbols=EURUSD,USDGBP,EURJPY,CHFDKK'
              },
              {
                name: 'Twitter',
                url: 'https://api.twitter.com/1.1/statuses/user_timeline.json'
              },
              {
                name: 'nyTimes',
                url: 'http://api.nytimes.com/svc/news/v3/content/all/all.json'
              }
            ];

            vm.isConnected = false;
            vm.errorMsg = null;
            vm.consumerKey = '3bslD2ptMQ9vhaBOURUGlPEIu';
            vm.consumerSecret = '1oE5PTjltVglLuIIKj4d2pZRdDCPdhcW6SHZPI6V2VWFKsS0ld';
            vm.accessToken = '1881073466-iLytONO2likj7qKuCNeVGm18DoFpmhSJL1xhGo8';
            vm.accessTokenSecret = 'IWTzZeasxY74TOpWiY7w3WKahahBiGqgS5qUzjZsdjFRC';
            vm.nyKey = 'a4c18d60a676da3df3e770435f39bd44:17:74140094';
            vm.xigniteToken = '9E68A32E39194B23BF06F16A0E16DEAB';
        };

        vm.addHeader = function () {
            vm.headers.push({name: "", value: ""});
        }

        vm.removeHeader = function (index) {
            vm.headers.splice(index, 1);
            vm.headersToArray();
        }

        vm.headersToArray = function () {
            var out = [];
            vm.headers.forEach(function (header) {
                out.push(header.name + ":" + header.value);
            });
            return out;
        }


        function pollingRequest () {
          var polling =  AsyncPolling(function (end) {
            // vm.headers.push('Access-Control-Allow-Origin:*');
            // vm.headers.push('Access-Control-Allow-Methods:GET, PUT, POST, DELETE, OPTIONS');
            // $.ajaxSetup({
            //     beforeSend: function(xhr) {
            //         xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            //         xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
            //     }
            // });
            // Do whatever you want.
            $.get(vm.url, function(data, status){
                // alert("Data: " + data + "\nStatus: " + status);
                // document.getElementById("demo").innerHTML = JSON.stringify(data);
                if (i === 0) {
                  $scope.originData = data;
                  $scope.datasStringify = diffUsingJS("", JSON.stringify(data, null, 2));
                  $scope.patchStringify1 = "";
                  $scope.patchStringify2 = "";
                  $scope.patchStringify3 = "";
                  $scope.patchStringify4 = "";
                  $scope.patchStringify5 = "";
                  if (Object.prototype.toString.call(data) === '[object Array]') {
                      $scope.originData = data;
                      vm.setTab(1);
                  } else {
                      vm.setTab(2);
                  }
                  $scope.datas = data;
                  $scope.$digest();
                } else {
                  // if (patch.length > vm.limitNbPatch) {
                  //     patch.splice(vm.limitNbPatch, patch.length - vm.limitNbPatch);
                  //     vm.displayError("Too many operations in patch, only " + vm.limitNbPatch + " firsts operations are applied");
                  // }
                  if (!vm.isPatching) {
                      vm.isPatching = true;
                      $scope.$digest();
                      $timeout(function () {
                          $log.info('Received new data:' + JSON.stringify(data).length);

                          var oldDatas =JSON.stringify($scope.datas, null, 2);

                          $scope.datas = data;
                         // FJP
                         var fjpPatch = jsonpatch.compare(JSON.parse(oldDatas), $scope.datas);
                         var jiffPatch = jiff.diff(JSON.parse(oldDatas), $scope.datas);
                         var jdrPatch = jdr.diff(JSON.parse(oldDatas), $scope.datas);
                         var rfcPatch = rfc6902.createPatch(JSON.parse(oldDatas), $scope.datas);
                         var j8Patch = window.JSON8Patch.diff(JSON.parse(oldDatas), $scope.datas);

                         console.log("old: "+oldDatas.length);
                         console.log("new: "+JSON.stringify($scope.datas).length);
                         console.log("new: "+JSON.stringify(data).length);
                          // render Array
                          if (Object.prototype.toString.call($scope.datas) === '[object Array]') {
                              $scope.originData = $scope.datas;
                          }
                          // render Patched JSON document
                          $scope.datasStringify = diffUsingJS(oldDatas, JSON.stringify($scope.datas, null, 2));
                          // render JSON Patch Operations
                          // $scope.patchStringify1 += formatPatch(fjpPatch);
                          // $scope.patchStringify2 += formatPatch(jiffPatch);
                          // $scope.patchStringify3 += formatPatch(jdrPatch);
                          // $scope.patchStringify4 += formatPatch(rfcPatch);
                          // $scope.patchStringify5 += formatPatch(j8Patch);

                          $scope.patchStringify1 = fjpPatch;
                          $scope.patchStringify2 = jiffPatch;
                          $scope.patchStringify3 = jdrPatch;
                          $scope.patchStringify4 = rfcPatch;
                          $scope.patchStringify5 = j8Patch;


                          $scope.$digest();
                          // Scroll JSON Patch operations container to bottom
                          // $("#patchCtn").scrollTop($("#patchCtn")[0].scrollHeight);
                          vm.isPatching = false;
                          $scope.$digest();
                      });
                  }
                }

              i++;
            });

            // Then notify the polling when your job is done:
            end();
            // This will schedule the next call.
          }, 15000).run();
        }

        vm.connect = function () {
            $log.info('Opening streamdataio connection with the url: ' + vm.url);
            vm.setBusyCursor(true);

            // extract headers
            var headers = [];

            if (vm.headers.length > 0 && vm.headers[0].name != "" && vm.headers[0].value != "") {
                headers = vm.headersToArray(vm.headers);
            }

            var signatureStrategy;
            if (typeof AuthStrategy === 'undefined') {
                signatureStrategy = null;
            } else {
                if (vm.signature) {
                    // signature checkbox is checked: setup a signatureStrategy
                    signatureStrategy = AuthStrategy.newSignatureStrategy(vm.token, vm.pk);
                } else {
                    signatureStrategy = null;
                }
            }

            $log.info('Connection is opened');
            vm.setBusyCursor(false);
            vm.initDatas();
            // $scope.$digest();
            vm.isConnected = true;
            $scope.datas = null;
            $scope.options={
              "mode": "code",
              "modes": [
                "tree",
                "form",
                "code",
                "text"
              ],
              "history": false
            };

            i = 0;

            var cb = new Codebird;

            switch (vm.urls.name) {
              case "Twitter":
                var polling =  AsyncPolling(function (end) {
                  // Do whatever you want.
                  $(document).ready(function(){

                    cb.setConsumerKey(vm.consumerKey, vm.consumerSecret);
                    cb.setToken(vm.accessToken, vm.accessTokenSecret); // see above
                    vm.url = vm.urls.url;
                    cb.__call(
                      "statuses_homeTimeline",
                      {},
                      function (reply, rate, err) {
                        console.log(JSON.stringify(reply).length);
                        if (i === 0) {
                          $scope.originData = reply;
                          $scope.datasStringify = diffUsingJS("", JSON.stringify(reply, null, 2));
                          $scope.patchStringify1 = "";
                          $scope.patchStringify2 = "";
                          $scope.patchStringify3 = "";
                          $scope.patchStringify4 = "";
                          $scope.patchStringify5 = "";
                          if (Object.prototype.toString.call(reply) === '[object Array]') {
                              $scope.originData = reply;
                              vm.setTab(1);
                          } else {
                              vm.setTab(2);
                          }
                          $scope.datas = reply;
                          $scope.$digest();
                        } else {
                          // if (patch.length > vm.limitNbPatch) {
                          //     patch.splice(vm.limitNbPatch, patch.length - vm.limitNbPatch);
                          //     vm.displayError("Too many operations in patch, only " + vm.limitNbPatch + " firsts operations are applied");
                          // }
                          if (!vm.isPatching) {
                              vm.isPatching = true;
                              $scope.$digest();
                              $timeout(function () {
                                  $log.info('Received new data:' + JSON.stringify(reply).length);

                                  var oldDatas =JSON.stringify($scope.datas, null, 2);

                                  $scope.datas = reply;
                                 // FJP
                                 var fjpPatch = jsonpatch.compare(JSON.parse(oldDatas), $scope.datas);
                                 var jiffPatch = jiff.diff(JSON.parse(oldDatas), $scope.datas);
                                 var jdrPatch = jdr.diff(JSON.parse(oldDatas), $scope.datas);
                                 var rfcPatch = rfc6902.createPatch(JSON.parse(oldDatas), $scope.datas);
                                 var j8Patch = window.JSON8Patch.diff(JSON.parse(oldDatas), $scope.datas);

                                 console.log("old: "+oldDatas.length);
                                 console.log("new: "+JSON.stringify($scope.datas).length);
                                 console.log("new: "+JSON.stringify(reply).length);
                                  // render Array
                                  if (Object.prototype.toString.call($scope.datas) === '[object Array]') {
                                      $scope.originData = $scope.datas;
                                  }
                                  // render Patched JSON document
                                  $scope.datasStringify = diffUsingJS(oldDatas, JSON.stringify($scope.datas, null, 2));
                                  // render JSON Patch Operations
                                  // $scope.patchStringify1 += formatPatch(fjpPatch);
                                  // $scope.patchStringify2 += formatPatch(jiffPatch);
                                  // $scope.patchStringify3 += formatPatch(jdrPatch);
                                  // $scope.patchStringify4 += formatPatch(rfcPatch);
                                  // $scope.patchStringify5 += formatPatch(j8Patch);

                                  $scope.patchStringify1 = fjpPatch;
                                  $scope.patchStringify2 = jiffPatch;
                                  $scope.patchStringify3 = jdrPatch;
                                  $scope.patchStringify4 = rfcPatch;
                                  $scope.patchStringify5 = j8Patch;


                                  $scope.$digest();
                                  // Scroll JSON Patch operations container to bottom
                                  // $("#patchCtn").scrollTop($("#patchCtn")[0].scrollHeight);
                                  vm.isPatching = false;
                                  $scope.$digest();
                              });
                          }
                        }

                      i++;
                      }
                    );
                  });

                  // Then notify the polling when your job is done:
                  end();
                  // This will schedule the next call.
                }, 15000).run();
                break;

              case "Xignite":
                  vm.url = vm.urls.url + '&_token=' + vm.xigniteToken;
                  pollingRequest();
                  break;

              case "nyTimes":
                  vm.url = vm.urls.url + '?api-key=' + vm.nyKey;
                  pollingRequest();
                  break;

              case "Stackoverflow":
                  vm.url = vm.urls.url;
                  pollingRequest();
                  break;


         }

      };

        vm.disconnect = function () {
            $log.info('Closing the connection of streamdataio');

            // streamdata.close();
            vm.isConnected = false;
            vm.isPatching = false;
            vm.initDatas();
        };

        vm.setBusyCursor = function (status) {
            if (status) {
                $("body").css("cursor", "progress");
            } else {
                $("body").css("cursor", "default");
            }
        };

        vm.initDatas = function () {
            $scope.originData = null;
            $scope.datasStringify = "<p/>";
            $scope.patchStringify1 = "";
            $scope.patchStringify2 = "";
            $scope.patchStringify3 = "";
            $scope.patchStringify4 = "";
            $scope.patchStringify5 = "";
        };

        vm.displayError = function (errMsg) {
            vm.errorMsg = errMsg;
            $scope.$digest();

            $timeout(function () {
                vm.errorMsg = null;
            }, 3000);
        }

        vm.tab = 1;

        vm.setTab = function (tabId) {
            vm.tab = tabId;
        };

        vm.isSet = function (tabId) {
            return vm.tab === tabId;
        };

        vm.init();

    };


    function diffUsingJS(base, newTxt, viewType) {
        viewType = viewType || 1;
        var base = difflib.stringAsLines(base),
            newTxt = difflib.stringAsLines(newTxt),
            sm = new difflib.SequenceMatcher(base, newTxt),
            opcodes = sm.get_opcodes();

        return diffview.buildView({
            baseTextLines: base,
            newTextLines: newTxt,
            opcodes: opcodes,
            baseTextName: "JSON document",
            newTextName: "JSON patched document",
            contextSize: null,
            viewType: viewType
        });
    }

    function formatPatch(patch) {
        var patchStr = syntaxHighlight(patch);
        patchStr = patchStr.replace(/{/g, '<br/>  {').replace(/}]/g, '}<br/>]');
        return "<p>" + patchStr + "</p>";
    }

    function syntaxHighlight(json) {
        json = JSON.stringify(json);
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    function ItemController($scope, $timeout) {
        $scope.$watch('cellValue', function () {
            $scope.$parent.isActive = true;

            $timeout(function () {
                $scope.$parent.isActive = false;
            }, 2000);
        });
    };

    angular
        .module('app', ['ngSanitize', 'jsonFormatter'])
        .controller('AppController', ['$scope', '$log', '$timeout', '$http', AppController])
        .controller('ItemController', ['$scope', '$timeout', ItemController])
        .directive('bindHtmlUnsafe', function ($parse, $compile) {
            return function ($scope, $element, $attrs) {
                var compile = function (newHTML) {
                    newHTML = $compile(newHTML)($scope);
                    $element.html('').append(newHTML);
                };

                var htmlName = $attrs.bindHtmlUnsafe;

                $scope.$watch(htmlName, function (newHTML) {
                    if (!newHTML) return;
                    compile(newHTML);
                });

            };
        })
        .directive('popup', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    ngModel: '=',
                    options: '=popup'
                },
                link: function (scope, element) {
                    scope.$watch('ngModel', function (val) {
                        element.attr('data-content', val);
                    });

                    var options = scope.options || {};

                    var title = options.title || null;
                    var placement = options.placement || 'right';
                    var html = options.html || false;
                    var delay = options.delay ? angular.toJson(options.delay) : null;
                    var trigger = options.trigger || 'hover';

                    element.attr('title', title);
                    element.attr('data-placement', placement);
                    element.attr('data-html', html);
                    element.attr('data-delay', delay);
                    element.popover({trigger: trigger});
                }
            };
        });
})();
