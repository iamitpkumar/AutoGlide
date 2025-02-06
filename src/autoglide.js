(function($) {
  $.fn.psEndlessScroll = function() {
      return this.each(function() {
          const $container = $(this);
          const $content = $container.find('.autoglide-content');
          
          const settings = {
              speed: $container.data('speed') || 20,
              gap: $container.data('gap') || 20,
              direction: $container.data('direction') || 'left'
          };

          function getResponsiveDimension(dimension) {
              const windowWidth = $(window).width();
              
              if (windowWidth < 768 && $container.data(`sm-${dimension}`)) {
                  return $container.data(`sm-${dimension}`);
              }
              if (windowWidth < 1024 && $container.data(`md-${dimension}`)) {
                  return $container.data(`md-${dimension}`);
              }
              if (windowWidth < 1440 && $container.data(`lg-${dimension}`)) {
                  return $container.data(`lg-${dimension}`);
              }
              if (windowWidth >= 1440 && $container.data(`xl-${dimension}`)) {
                  return $container.data(`xl-${dimension}`);
              }

              return $container.data(dimension) || null;
          }

          function setupScrollAnimation() {
          const isHorizontal = settings.direction === 'left' || settings.direction === 'right';
          const items = $content.children();
          let totalSize = 0;

          // Calculate total width/height including gaps
          items.each(function () {
            if (isHorizontal) {
              totalSize += $(this).outerWidth(true); // Include margins
            } else {
              totalSize += $(this).outerHeight(true);
            }
          });

          // Clone items until content is at least twice the container's size
          while (totalSize < $container[isHorizontal ? 'width' : 'height']() * 2) {
            $content.append($content.children().clone());
            totalSize *= 2;
          }

          // Create unique keyframes
          const animationName = `scroll-${settings.direction}-${Math.random().toString(36).substr(2, 9)}`;
          const keyframes = document.createElement('style');

          if (isHorizontal) {
            keyframes.innerHTML = `
              @keyframes ${animationName} {
                  from { transform: translateX(${settings.direction === 'right' ? -totalSize / 2 : 0}px); }
                  to { transform: translateX(${settings.direction === 'right' ? 0 : -totalSize / 2}px); }
              }
            `;
          } else {
            keyframes.innerHTML = `
              @keyframes ${animationName} {
                  from { transform: translateY(${settings.direction === 'bottom' ? -totalSize / 2 : 0}px); }
                  to { transform: translateY(${settings.direction === 'bottom' ? 0 : -totalSize / 2}px); }
              }
            `;

            // Set column display for vertical scrolling
            $content.css('flex-direction', 'column');
          }

          document.head.appendChild(keyframes);

          // Apply animation
          $content.css({
            'animation': `${animationName} ${settings.speed}s linear infinite`,
            'animation-delay': '0s'
            });
          }




          function init() {
              // Apply gaps
              if (settings.direction === 'left' || settings.direction === 'right') {
                  $content.children().css('margin-right', `${settings.gap}px`);
              } else {
                  $content.children().css('margin-bottom', `${settings.gap}px`);
              }

              // Clone content
              const originalContent = $content.html();
              $content.append(originalContent);

              // Apply dimensions and set up animation
              applyDimensions();
              setupScrollAnimation();

              // Handle resize
              let resizeTimer;
              $(window).on('resize', function() {
                  clearTimeout(resizeTimer);
                  resizeTimer = setTimeout(function() {
                      applyDimensions();
                      setupScrollAnimation();
                  }, 250);
              });

              // Pause on hover
              $container.hover(
                  () => $content.css('animation-play-state', 'paused'),
                  () => $content.css('animation-play-state', 'running')
              );
          }

          function applyDimensions() {
              const width = getResponsiveDimension('width');
              const height = getResponsiveDimension('height');

              if (width) $content.find('img').css('width', `${width}px`);
              if (height) $content.find('img').css('height', `${height}px`);
          }

          init();
      });
  };
})(jQuery);