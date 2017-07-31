window.addEventListener('DOMContentLoaded', () => {
  var Vue = window.Vue;
  var ImageCompressor = window.ImageCompressor;

  new Vue({
    el: '#app',

    data: function () {
      var vm = this;

      return {
        options: {
          width: undefined,
          height: undefined,
          quality: 0.8,
          mimeType: 'auto',
          convertSize: 5000000,
          success: function (file) {
            console.log('Output: ', file);
            vm.output = file;
            vm.$refs.input.value = '';
          },
          error: function (e) {
            window.alert(e.message);
          },
        },
        input: {},
        output: {},
      };
    },

    filters: {
      prettySize: function (size) {
        var kilobyte = 1024;
        var megabyte = kilobyte * kilobyte;

        if (size > megabyte) {
          return (size / megabyte).toFixed(2) + ' MB';
        } else if (size > kilobyte) {
          return (size / kilobyte).toFixed(2) + ' KB';
        } else if (size >= 0) {
          return size + ' B';
        }

        return '';
      },
    },

    methods: {
      compress: function (file) {
        if (!file) {
          return;
        }

        console.log('Input: ', file);
        this.input = file;
        new ImageCompressor(file, this.options);
      },

      change: function (e) {
        this.compress(e.target.files ? e.target.files[0] : null);
      },

      dragover: function(e) {
        e.preventDefault();
      },

      drop: function(e) {
        e.preventDefault();
        this.compress(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
      },
    },
  });
});
