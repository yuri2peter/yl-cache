'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** 基于LocalStorage的前端缓存 */
module.exports = (_temp = _class = function () {
  function YlCache() {
    var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, YlCache);

    this.namespace = namespace.replace(/\//g, '-');
  }
  /**
   * 设置一个缓存
   * @param key string 键名
   * @param value mixed 键值（可序列化的）
   * @param expire int 有效时间（单位：秒）
   * */


  _createClass(YlCache, [{
    key: 'set',
    value: function set(key, value) {
      var expire = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var path = this._getPath(key);
      var data = {
        key: key,
        value: value,
        expire: expire,
        createAt: Date.now()
      };
      localStorage.setItem(path, JSON.stringify(data));
    }

    /**
     * 查询是否有一个有效缓存
     * @param key string 键名
     * @return boolean
     * */

  }, {
    key: 'has',
    value: function has(key) {
      var path = this._getPath(key);
      var data = localStorage.getItem(path);
      if (data === null) return false;
      try {
        data = JSON.parse(data);
        if (data.expire === 0 || data.expire * 1000 + data.createAt > Date.now()) {
          return true;
        } else {
          this.remove(key);
          return false;
        }
      } catch (e) {
        return false;
      }
    }

    /**
     * 获得一个缓存
     * @param key string 键名
     * @param defaultValue mixed 默认值
     * @return mixed
     * */

  }, {
    key: 'get',
    value: function get(key) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var path = this._getPath(key);
      var data = localStorage.getItem(path);
      if (data === null) return defaultValue;
      try {
        data = JSON.parse(data);
        if (data.expire === 0 || data.expire * 1000 + data.createAt > Date.now()) {
          return data.value;
        } else {
          this.remove(key);
          return defaultValue;
        }
      } catch (e) {
        return defaultValue;
      }
    }

    /**
     * 获得并删除一个缓存
     * @param key string 键名
     * @param defaultValue mixed 默认值
     * @return mixed
     * */

  }, {
    key: 'pop',
    value: function pop(key) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var result = this.get(key, defaultValue);
      this.remove(key);
      return result;
    }

    /**
     * 删除一个缓存
     * @param key string 键名
     * */

  }, {
    key: 'remove',
    value: function remove(key) {
      var path = this._getPath(key);
      localStorage.removeItem(path);
    }
  }, {
    key: '_getPath',
    value: function _getPath(key) {
      return '/' + this.namespace + '/' + key;
    }
  }]);

  return YlCache;
}(), _class.EXPIRE_TIME = {
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
  ONE_MONTH: 2592000
}, _temp);