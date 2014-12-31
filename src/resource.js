/**
 * Modified version of angular resource.
 *
 * Copyright (c) 2010-2014 Google, Inc. http://angularjs.org
 *           (c) 2014 Adi Sayoga
 *
 * License: MIT
 */

'use strict';
angular.module('sg-resource', []);

angular.module('sg-resource').factory('resource', function($http, $parse) {
  var DEFAULT_ACTIONS = {
    query:  { method: 'GET', isArray: true, isResource: true, wrap: 'data' },
    get:    { method: 'GET', isResource: true },
    post:   { method: 'POST', isResource: true, hasBody: true },
    put:    { method: 'PUT', isResource: true, hasBody: true },
    remove: { method: 'DELETE' }
  };

  function encodeUriSegment(val) {
    return encodeUriQuery(val, true).
      replace(/%26/gi, '&').
      replace(/%3D/gi, '=').
      replace(/%2B/gi, '+');
  }

  function encodeUriQuery(val, pctEncodeSpaces) {
    return encodeURIComponent(val).
      replace(/%40/gi, '@').
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
  }

  function routeUrl(template, params) {
    template += '#';
    var urlParams = {};
    angular.forEach(template.split(/\W/), function(param) {
      if (param && (new RegExp('(^|[^\\\\]):' + param + '\\W').test(template))) {
        urlParams[param] = true;
      }
    });
    template = template.replace(/\\:/g, ':');

    var url = template;
    params = params || {};
    angular.forEach(urlParams, function(_, urlParam) {
      var val = params.hasOwnProperty(urlParam) ? params[urlParam] : null;
      if (val) {
        var encodedVal = encodeUriSegment(val);
        url = url.replace(new RegExp(':' + urlParam + '(\\W)', 'g'), encodedVal + '$1');
      } else {
        url = url.replace(new RegExp('(\/?):' + urlParam + '(\\W)', 'g'),
          function(match, leadingSlashes, tail) {
            if (tail.charAt(0) === '/') {
              return tail;
            } else {
              return leadingSlashes + tail;
            }
          });
      }
    });

    url = url.replace(/\/?#$/, '');
    var query = [];
    angular.forEach(params, function(value, key) {
      if (!urlParams[key]) {
        query.push(encodeUriQuery(key) + '=' + encodeUriQuery(value));
      }
    });
    query.sort();
    url = url.replace(/\/*$/, '');
    return url + (query.length ? '?' + query.join('&') : '');
  }

  function extractParams(params, data) {
    var ids = {};
    angular.forEach(params, function(value, key) {
      ids[key] = (value && value.charAt && value.charAt(0) === '@') ?
                 $parse(value.substr(1))(data) : value;
    });
    return ids;
  }

  function deepExtend(dst) {
    for (var i = 0, length = arguments.length; i < length; i++) {
      var obj = arguments[i];
      if (obj === dst) continue;

      for (var key in obj) {
        var value = obj[key];
        if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
          deepExtend(dst[key], value);
        } else {
          dst[key] = value;
        }
      }
    }
    return dst;
  }

  var resourceFactory = function(url, paramDefaults, actions) {
    if (actions) actions = JSON.parse(JSON.stringify(actions));
    actions = deepExtend(DEFAULT_ACTIONS, actions);
    var NewResource = function(data) {
      angular.copy(data, this);
    };

    NewResource.prototype = {
      isNew: function() {
        return true;
      },
      save: function() {
        return Resource.post(this);
      }
    };

    var Resource = function(data) {
      angular.copy(data, this);
    };

    Resource.prototype = {
      isNew: function() {
        return false;
      },
      save: function() {
        return Resource.put(paramDefaults, this);
      },
      remove: function() {
        return Resource.remove(paramDefaults, this);
      }
    };

    Resource.create = function(data) {
      return new NewResource(data);
    };

    angular.forEach(actions, function(action, actionName) {
      Resource[actionName] = function(params, data) {
        if (arguments.length === 1 && action.hasBody) {
          data = params;
          params = action.method === 'PUT' ? paramDefaults : {};
        }
        params = angular.extend({}, action.params, params);

        return $http({
          method: action.method,
          url: routeUrl(action.url || url, extractParams(params, data)),
          data: data
        })
        .then(function(response) {
          var data = response.data;
          if (!action.isResource) return data;
          if (!action.isArray) return new Resource(data);
          var items = angular.isArray(data) ? data : data[action.wrap];
          angular.forEach(items, function(item, i) {
            items[i] = new Resource(item);
          });
          return data;
        });
      };
    });
    return Resource;
  };

  return resourceFactory;
});
