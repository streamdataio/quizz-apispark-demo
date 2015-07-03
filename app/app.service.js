'use strict';

(function () {

  function apiSparkInterceptor(quizzConfig, $q) {
    return {
      request: function (config) {
        config.headers = config.headers || {};

        var authorization = 'Basic ' + btoa(quizzConfig.apiSparkLogin + ':' + quizzConfig.apiSparkPassword);
        config.headers['Authorization'] = authorization;
        return config;
      },
      response: function (response) {
        return response || $q.when(response);
      }
    };
  };

  function apiSparkStreamdataioFactory(quizzConfig, $rootScope) {
    return {
      newStreamdata: function (url) {
        var headers = ['Authorization: Basic ' + btoa(quizzConfig.apiSparkLogin + ':' + quizzConfig.apiSparkPassword)];
        var streamdata = streamdataio.createEventSource(url, quizzConfig.streamdataioAppToken, headers);
        var data = [];

        function open() {
          streamdata.open();
          return this;
        }

        function onData(onDataCallback) {
          streamdata.onData(function (snapshot) {
            data = snapshot;

            $rootScope.$apply(function () {
              onDataCallback(data);
            });
          });

          return this;
        }

        function onPatch(onPatchCallback) {
          streamdata.onPatch(function (patches) {
            jsonpatch.apply(data, patches);

            $rootScope.$apply(function () {
              onPatchCallback(data);
            });
          });

          return this;
        }

        function close() {
          streamdata.close();
          return this;
        }

        function onError(onErrorCallback) {
          streamdata.onError(function (error) {
            onErrorCallback(error);
          });

          return this;
        }

        return {
          open: open,
          onData: onData,
          onPatch: onPatch,
          onError: onError,
          close: close
        };
      }
    }
  }

  angular
    .module('QuizzApp')
    .factory('apiSparkInterceptor', ['quizzConfig', '$q', apiSparkInterceptor])
    .factory('apiSparkStreamdataioFactory', ['quizzConfig', '$rootScope', apiSparkStreamdataioFactory])
  ;


})();