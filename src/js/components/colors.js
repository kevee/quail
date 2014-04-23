/**
 * Test callback for color tests. This handles both WAI and WCAG
 * color contrast/luminosity.
 */
quail.components.color = function(quail, test, Case, options) {
  var colors = {
    /**
     * Returns the lumosity of a given foreground and background object,
     * in the format of {r: red, g: green, b: blue } in rgb color values.
     */
    getLuminosity : function(foreground, background) {
      foreground = this.cleanup(foreground);
      background = this.cleanup(background);

      var RsRGB = foreground.r/255;
      var GsRGB = foreground.g/255;
      var BsRGB = foreground.b/255;
      var R = (RsRGB <= 0.03928) ? RsRGB/12.92 : Math.pow((RsRGB+0.055)/1.055, 2.4);
      var G = (GsRGB <= 0.03928) ? GsRGB/12.92 : Math.pow((GsRGB+0.055)/1.055, 2.4);
      var B = (BsRGB <= 0.03928) ? BsRGB/12.92 : Math.pow((BsRGB+0.055)/1.055, 2.4);

      var RsRGB2 = background.r/255;
      var GsRGB2 = background.g/255;
      var BsRGB2 = background.b/255;
      var R2 = (RsRGB2 <= 0.03928) ? RsRGB2/12.92 : Math.pow((RsRGB2+0.055)/1.055, 2.4);
      var G2 = (GsRGB2 <= 0.03928) ? GsRGB2/12.92 : Math.pow((GsRGB2+0.055)/1.055, 2.4);
      var B2 = (BsRGB2 <= 0.03928) ? BsRGB2/12.92 : Math.pow((BsRGB2+0.055)/1.055, 2.4);
      var l1, l2;
      l1 = (0.2126 * R + 0.7152 * G + 0.0722 * B);
      l2 = (0.2126 * R2 + 0.7152 * G2 + 0.0722 * B2);

      return Math.round((Math.max(l1, l2) + 0.05)/(Math.min(l1, l2) + 0.05)*10)/10;
    },

    /**
     * Returns the average color for a given image
     * using a canvas element.
     */
    fetchImageColorAtPixel : function(img, x, y) {
      x = typeof x !== 'undefined' ? x : 1;
      y = typeof y !== 'undefined' ? y : 1;
      var can = document.createElement('canvas');
      var context = can.getContext('2d');
      context.drawImage(img, 0, 0);
      var data = context.getImageData(0, 0, 1, 1).data;
      return 'rgb(' + data[0] + ',' + data[1] + ',' + data[2] + ')';
    },

    /**
     * Returns whether an element's color passes
     * WCAG at a certain contrast ratio.
     */
    passesWCAG : function(element, level) {
      return this.passesWCAGColor(element, this.getColor(element, 'foreground'), this.getColor(element, 'background'), level);
    },

    /**
     * Returns whether an element's color passes
     * WCAG at a certain contrast ratio.
     */
    passesWCAGColor : function(element, foreground, background, level) {
      if (typeof level === 'undefined') {
        if (quail.components.convertToPx(element.css('font-size')) >= 18) {
          level = 3;
        }
        else if (quail.components.convertToPx(element.css('font-size')) >= 14 &&
          (element.css('font-weight') === 'bold' || parseInt(element.css('font-weight'), 10) >= 700)) {
          level = 3;
        }
        else {
          level = 5;
        }
      }
      return (this.getLuminosity(foreground, background) > level);
    },

    /**
     * Returns whether an element's color passes
     * WAI brightness levels.
     */
    passesWAI : function(element) {
      var foreground = this.cleanup(this.getColor(element, 'foreground'));
      var background = this.cleanup(this.getColor(element, 'background'));
      return this.passesWAIColor(foreground, background);
    },

    /**
     * Returns whether an element's color passes
     * WAI brightness levels.
     */
    passesWAIColor : function(foreground, background) {
      return (this.getWAIErtContrast(foreground, background) > 500 &&
              this.getWAIErtBrightness(foreground, background) > 125);
    },

    /**
     * Compused contrast of a foreground and background
     * per the ERT contrast spec.
     */
    getWAIErtContrast : function(foreground, background) {
      var diffs = this.getWAIDiffs(foreground, background);
      return diffs.red + diffs.green + diffs.blue;
    },

    /**
     * Computed contrast of a foreground and background
     * per the ERT brightness spec.
     */
    getWAIErtBrightness : function(foreground, background) {
      var diffs = this.getWAIDiffs(foreground, background);
      return ((diffs.red * 299) + (diffs.green * 587) + (diffs.blue * 114)) / 1000;

    },

    /**
     * Returns differences between two colors.
     */
    getWAIDiffs : function(foreground, background) {
      var diff = { };
      diff.red = Math.abs(foreground.r - background.r);
      diff.green = Math.abs(foreground.g - background.g);
      diff.blue = Math.abs(foreground.b - background.b);
      return diff;
    },

    /**
     * Retrieves the background or foreground of an element.
     * There are some normalizations here for the way
     * different browsers can return colors, and handling transparencies.
     */
    getColor : function(element, type) {
      if (type === 'foreground') {
        return (element.css('color')) ? element.css('color') : 'rgb(255,255,255)';
      }

      if (this.hasBackgroundColor(element)) {
        return (element.css('background-color')) ? element.css('background-color') : 'rgb(0,0,0)';
      }
      var color = 'rgb(0,0,0)';
      element.parents().each(function(){
        if (colors.hasBackgroundColor(element)) {
          color = element.css('background-color');
          return false;
        }
      });
      return color;
    },

    /**
     * Returns an object with rgba taken from a string.
     */
    cleanup : function(color) {
      if (typeof color === 'object') {
        return color;
      }

      if (color.substr(0, 1) === '#') {
        return { r : parseInt(color.substr(1, 2), 16),
                 g : parseInt(color.substr(3, 2), 16),
                 b : parseInt(color.substr(5, 2), 16),
                 a : false
               };
      }

      if (color.substr(0, 3) === 'rgb') {
        color = color.replace('rgb(', '').replace('rgba(', '').replace(')', '').split(',');
        return { r : color[0],
                 g : color[1],
                 b : color[2],
                 a : ((typeof color[3] === 'undefined') ? false : color[3])
               };
      }
    },

    /**
     * Returns background image of an element or its parents.
     */
    getBackgroundImage: function(element) {
      while (element.length > 0) {
        if (element.css('background-image') && element.css('background-image') !== 'none' && element.css('background-image').search(/^(.*?)url(.*?)$/i) !== -1) {
          return element.css('background-image').replace('url(', '').replace(/'/, '').replace(')', '');
        }
        element = element.parent();
      }
      return false;
    },

    /**
     * Returns background image of an element or its parents.
     */
    getBackgroundGradient: function(element) {
      var notempty = function(s) {
        return $.trim(s) !== '';
      };
      while (element.length > 0) {
        // Exit if element has a background color.
        if (this.hasBackgroundColor(element)) {
          return false;
        }
        if (element.css('background-image') && element.css('background-image') !== 'none' && element.css('background-image').search(/^(.*?)gradient(.*?)$/i) !== -1) {
          var gradient = element.css('background-image').match(/gradient(\(.*\))/g);
          if (gradient.length > 0) {
            gradient = gradient[0].replace(/(linear|radial|from|\bto\b|gradient|top|left|bottom|right|\d*%)/g, '');
            return $.grep(gradient.match(/(rgb\([^\)]+\)|#[a-z\d]*|[a-z]*)/g), notempty);
          }
        }
        element = element.parent();
      }
      return false;
    },

    /**
     * Calculates average color of an image.
     */
    getAverageRGB: function(img) {
      var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0, g:0, b:0, a:0},
        count = 0;

      if (!context) {
        return defaultRGB;
      }

      height = canvas.height = img.height;
      width = canvas.width = img.width;
      context.drawImage(img, 0, 0);

      try {
        data = context.getImageData(0, 0, width, height);
      } catch(e) {
        return defaultRGB;
      }

      length = data.data.length;

      while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
      }

      // ~~ used to floor values
      rgb.r = ~~(rgb.r/count);
      rgb.g = ~~(rgb.g/count);
      rgb.b = ~~(rgb.b/count);

      return rgb;
    },

    /**
     * Convert color to hex value.
     */
    colorToHex: function(c) {
      var m = /rgba?\((\d+), (\d+), (\d+)/.exec(c);
      return m ? '#' + (1 << 24 | m[1] << 16 | m[2] << 8 | m[3]).toString(16).substr(1) : c;
    },

    /**
     * Check if element has a background color.
     */
    hasBackgroundColor: function(element) {
      return element.css('background-color') !== 'rgba(0, 0, 0, 0)' &&
        element.css('background-color') !== 'transparent';
    },

    /**
     * Traverse visual tree for background property.
     */
    traverseVisualTreeForBackground: function(element, property) {
      var notempty = function(s) {
        return $.trim(s) !== '';
      };

      var foundIt;
      var scannedElements = [];

      // Scroll to make sure element is visible.
      $(window).scrollTop(element.offset().top);

      // Get relative x and y.
      var x = element.offset().left - $(window).scrollLeft();
      var y = element.offset().top - $(window).scrollTop();

      // Hide current element.
      scannedElements.push({
        element: element,
        visibility: element.css('visibility')
      });
      element.css('visibility', 'hidden');

      // Get element at position x, y.
      var el = document.elementFromPoint(x,y);
      while (foundIt === undefined && el && el.tagName !== 'BODY' && el.tagName !== 'HTML') {
        el = $(el);
        // Only check visible elements.
        if (el.css('visibility') !== "hidden" && el.css('display') !== 'none') {
          switch (property) {
          case 'background-color':
            if (this.hasBackgroundColor(el)) {
              foundIt = el.css('background-color');
            }
            break;
          case 'background-gradient':
            if (el.css('background-image') && el.css('background-image') !== 'none' && el.css('background-image').search(/^(.*?)gradient(.*?)$/i) !== -1) {
              var gradient = el.css('background-image').match(/gradient(\(.*\))/g);
              if (gradient.length > 0) {
                gradient = gradient[0].replace(/(linear|radial|from|\bto\b|gradient|top|left|bottom|right|\d*%)/g, '');
                foundIt = $.grep(gradient.match(/(rgb\([^\)]+\)|#[a-z\d]*|[a-z]*)/g), notempty);
              }
            }
            // Bail out if element has a background color;
            if (this.hasBackgroundColor(el)) {
              foundIt = false;
            }
            break;
          case 'background-image':
            if (el.css('background-image') && el.css('background-image') !== 'none' && el.css('background-image').search(/^(.*?)url(.*?)$/i) !== -1) {
              return el.css('background-image').replace('url(', '').replace(/'/, '').replace(')', '');
            }
            // Bail out if element has a background color;
            if (this.hasBackgroundColor(el)) {
              foundIt = false;
            }
            break;
          }
          scannedElements.push({
            element: el,
            visibility: el.css('visibility')
          });
          el.css('visibility', 'hidden');
          el = document.elementFromPoint(x,y);
        }
      }

      // Reset visibility.
      for(var i = 0; i < scannedElements.length; i++){
        scannedElements[i].element.css('visibility', scannedElements[i].visibility);
      }

      return foundIt;
    },

    /**
     * Get first element behind current with a background color.
     */
    getBehindElementBackgroundColor: function(element) {
      return colors.traverseVisualTreeForBackground(element, 'background-color');
    },

    /**
     * Get first element behind current with a background gradient.
     */
    getBehindElementBackgroundGradient: function(element) {
      return colors.traverseVisualTreeForBackground(element, 'background-gradient');
    },

    /**
     * Get first element behind current with a background image.
     */
    getBehindElementBackgroundImage: function(element) {
      return colors.traverseVisualTreeForBackground(element, 'background-image');
    }
  };

  test.get('$scope').find(options.options.selector).filter(quail.textSelector).each(function() {
    var $this = $(this);

    // Bail out is text is not readable.
    if (quail.isUnreadable($this.text())) {
      test.add(Case({
        element: this,
        expected: $this.closest('.quail-test').data('expected'),
        status: 'passed'
      }));
      return;
    }

    var failureFound = false;
    var img, i, rainbow, numberOfSamples;

    // Check text and background color using DOM.
    if ((options.options.algorithm === 'wcag' && !colors.passesWCAG($this)) ||
        (options.options.algorithm === 'wai' && !colors.passesWAI($this))) {
      test.add(Case({
        element: this,
        expected: $this.closest('.quail-test').data('expected'),
        status: 'failed'
      }));
      failureFound = true;
    }

    // Check text and background using element behind current element.
    if (!failureFound) {
      var backgroundColorBehind = colors.getBehindElementBackgroundColor($this);
      if (backgroundColorBehind) {
        if ((options.options.algorithm === 'wcag' && !colors.passesWCAGColor($this, colors.getColor($this, 'foreground'), backgroundColorBehind)) ||
            (options.options.algorithm === 'wai' && !colors.passesWAIColor(colors.getColor($this, 'foreground'), backgroundColorBehind))) {
          test.add(Case({
            element: this,
            expected: $this.closest('.quail-test').data('expected'),
            status: 'failed'
          }));
          failureFound = true;
        }
      }
    }

    // Check if there's a background-image using DOM.
    if (!failureFound) {
      var backgroundImage = colors.getBackgroundImage($this);
      if (backgroundImage) {
        img = new Image();
        img.src = backgroundImage;

        // Get average color of the background image.
        var averageColorBackgroundImage = colors.getAverageRGB(img);
        if ((options.options.algorithm === 'wcag' && !colors.passesWCAGColor($this, colors.getColor($this, 'foreground'), averageColorBackgroundImage)) ||
            (options.options.algorithm === 'wai' && !colors.passesWAIColor(colors.getColor($this, 'foreground'), averageColorBackgroundImage))) {
          test.add(Case({
            element: this,
            expected: $this.closest('.quail-test').data('expected'),
            status: 'failed'
          }));
          failureFound = true;
        }
      }
    }

    // Check if there's a background-image using element behind current element.
    if (!failureFound) {
      var behindBackgroundImage = colors.getBehindElementBackgroundImage($this);
      if (behindBackgroundImage) {
        img = new Image();
        img.src = behindBackgroundImage;

        // Get average color of the background image.
        var averageColorBehindBackgroundImage = colors.getAverageRGB(img);
        if ((options.options.algorithm === 'wcag' && !colors.passesWCAGColor($this, colors.getColor($this, 'foreground'), averageColorBehindBackgroundImage)) ||
            (options.options.algorithm === 'wai' && !colors.passesWAIColor(colors.getColor($this, 'foreground'), averageColorBehindBackgroundImage))) {
          test.add(Case({
            element: this,
            expected: $this.closest('.quail-test').data('expected'),
            status: 'failed'
          }));
          failureFound = true;
        }
      }
    }

    // Check if there's a background gradient using DOM.
    if (!failureFound) {
      var backgroundGradientColors = colors.getBackgroundGradient($this);
      if (backgroundGradientColors) {
        // Convert colors to hex notation.
        for (i = 0; i < backgroundGradientColors.length; i++) {
          if (backgroundGradientColors[i].substr(0, 3) === 'rgb') {
            backgroundGradientColors[i] = colors.colorToHex(backgroundGradientColors[i]);
          }
        }

        // Create a rainbow.
        /* global Rainbow */
        rainbow = new Rainbow();
        rainbow.setSpectrumByArray(backgroundGradientColors);
        numberOfSamples = backgroundGradientColors.length * 3;

        // Check each color.
        for (i = 0; !failureFound && i < numberOfSamples; i++) {
          if ((options.options.algorithm === 'wcag' && !colors.passesWCAGColor($this, colors.getColor($this, 'foreground'), '#' + rainbow.colourAt(i))) ||
              (options.options.algorithm === 'wai' && !colors.passesWAIColor(colors.getColor($this, 'foreground'), '#' + rainbow.colourAt(i)))) {
            test.add(Case({
              element: this,
              expected: $this.closest('.quail-test').data('expected'),
              status: 'failed'
            }));
            failureFound = true;
          }
        }
      }
    }

    // Check if there's a background gradient using element behind current element.
    if (!failureFound) {
      var behindGradientColors = colors.getBehindElementBackgroundGradient($this);
      if (behindGradientColors) {
        // Convert colors to hex notation.
        for (i = 0; i < behindGradientColors.length; i++) {
          if (behindGradientColors[i].substr(0, 3) === 'rgb') {
            behindGradientColors[i] = colors.colorToHex(behindGradientColors[i]);
          }
        }

        // Create a rainbow.
        /* global Rainbow */
        rainbow = new Rainbow();
        rainbow.setSpectrumByArray(behindGradientColors);
        numberOfSamples = behindGradientColors.length * 3;

        // Check each color.
        for (i = 0; !failureFound && i < numberOfSamples; i++) {
          if ((options.options.algorithm === 'wcag' && !colors.passesWCAGColor($this, colors.getColor($this, 'foreground'), '#' + rainbow.colourAt(i))) ||
              (options.options.algorithm === 'wai' && !colors.passesWAIColor(colors.getColor($this, 'foreground'), '#' + rainbow.colourAt(i)))) {
            test.add(Case({
              element: this,
              expected: $this.closest('.quail-test').data('expected'),
              status: 'failed'
            }));
            failureFound = true;
          }
        }
      }
    }

    if (!failureFound) {
      test.add(Case({
        element: this,
        expected: $this.closest('.quail-test').data('expected'),
        status: 'passed'
      }));
    }
  });
};
