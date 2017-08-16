window.addEventListener('DOMContentLoaded', () => {
  var Vue = window.Vue;
  var URL = window.URL || window.webkitURL;
  var ImageCompressor = window.ImageCompressor;

  new Vue({
    el: '#app',

    data: function () {
      var vm = this;

      return {
        options: {
          maxWidth: undefined,
          maxHeight: undefined,
          minWidth: 0,
          minHeight: 0,
          width: undefined,
          height: undefined,
          quality: 0.8,
          mimeType: '',
          convertSize: 5000000,
          success: function (file) {
            console.log('Output: ', file);

            if (URL) {
              file.outputURL=URL.createObjectURL(file);
            }

            vm.output.push(file);
            vm.$refs.input.value = '';
          },
          error: function (e) {
            window.alert(e.message);
          },
        },
        input: [{}],
        output: [{}],
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

        return 'N/A';
      },
    },

    methods: {
      compress: function (file) {
        if (!file) {
          return;
        }
        this.input = [];
        this.output = [];
        for(var i = 0 ; i < file.length ; ++i){
          if (URL) {
            file[i].inputURL = URL.createObjectURL(file[i]);
          }
          this.input.push(file[i]);
          new ImageCompressor(file[i], this.options);
        }

      },

      change: function (e) {
        this.compress(e.target.files ? e.target.files : null);
      },

      dragover: function(e) {
        e.preventDefault();
      },

      drop: function(e) {
        e.preventDefault();
        this.compress(e.dataTransfer.files ? e.dataTransfer.files : null);
      },
    },
  });
});
