define(['angularAMD', 'util', 'drag-event', 'drop-event'], function (angularAMD) {
  'use strict';
  angularAMD.factory('dlGridFactory', ['$compile', '$http', '$templateCache', 'storage', function ($compile, $http, $templateCache, storage) {

    function getTemplatePromise(templateUrl) {
      return $http.get(templateUrl,
        {cache: $templateCache}).then(function (result) {
          return result.data;
        });
    }

    var Grid = function ($this, options) {
      this.$grid = $this;
      this.options = $.extend({}, Grid.DEFAULTS, options);
      this.options.page.OrderBy = this.options.orderBy;
    };

    Grid.DEFAULTS = {
      url: '',
      orderBy: '',
      params: {},
      data: null,
      colModel: [],
      page: {
        PageIndex: 1,
        OrderBy: '',
        PageSize: 10,
        RecordCount: 0,
        show: true
      },
      autoLoad: true,
      width: 'auto',
      height: 'auto',
      cellMinWidth: 50,
      checkbox: true,
      bulkMenuUrl: '',
      onSuccess: null,
      onError: null,
      template: {
        head: {
          row: '<div class="dl-grid-head-row"></div>',
          cell: '<div class="dl-grid-head-cell"></div>',
          sort: '<div class="dl-grid-head-sort"><a class="asc"><i class="fa fa-sort-asc"></i></a><a class="desc"><i class="fa fa-sort-desc"></i></a></div>'
        },
        body: {
          row: '<div class="dl-grid-body-row"></div>',
          cell: '<div class="dl-grid-body-cell"><div class="dl-grid-body-c-content"></div></div>'
        },
        gContainer: '<div class="dl-grid-container"></div>',
        gLeft: '<div class="dl-grid-left"><div class="dl-grid-head">' +
        '<div class="dl-grid-head-row"></div></div><div class="hide-scroll"><div class="dl-grid-body"></div></div></div>',
        gRight: '<div class="dl-grid-right"><div class="hide-scroll">' +
        '<div class="dl-grid-head"><div class="dl-grid-head-row"></div></div>' +
        '</div><div class="scroll hide-scroll"><div class="dl-grid-body"></div></div></div>',
        page: '<div class="dl-grid-page"><div class="info">显示<b>{{from}}</b>到<b>{{to}}</b>,共<b>{{total}}</b>条</div><select class="form-control input-sm"><option value="10">10</option><option value="20">20</option><option value="50">50</option><option value="100">100</option></select><ul class="pagination pagination-sm">' +
        '<li><a class="first">&laquo;</a></li><li><a class="prev">&lt;</a></li><li><a class="next">&gt;</a></li>' +
        '<li><a class="last">&raquo;</a></li></ul></div>',
        colResize: '<div class="dl-grid-colResize"></div>',
        bulkMenu: '<div class= "dropdown bulkmenu" dropdown>' +
        '<a class="btn btn-xs default" dropdown-toggle dl-hover-click>' +
        '<i class="fa fa-cog"></i><i class="fa fa-angle-down"></i>' +
        '</a>' +
        '<ul class="dropdown-menu">{{template}}</ul></div>'
      }
    };

    Grid.prototype.init = function () {
      var self = this,
        options = this.options;
      this.gLeft = $(options.template.gLeft);
      this.gRight = $(options.template.gRight);
      this.gContainer = $(options.template.gContainer);
      this.gLeftBody = this.gLeft.find('.dl-grid-body');
      this.gRightBody = this.gRight.find('.dl-grid-body');
      this.gRightHead = this.gRight.find('.dl-grid-head');
      this.gLeftHead = this.gLeft.find('.dl-grid-head');
      this.scroll = this.gRight.find('div.scroll');

      var lastItem = this.options.colModel[this.options.colModel.length - 1];
      this.cellWidthPercent = typeof lastItem.width === 'string' && lastItem.width.indexOf('%') > 0;
      this.$grid.append(
        this.gContainer.append(this.gLeft).append(this.gRight)
      ).addClass('dl-grid');

      if (options.bulkMenuUrl) {
        getTemplatePromise(options.bulkMenuUrl).then(function (html) {
          self.bulkMenuHtml = html;
          self.buildTable();
        });
      } else {
        self.buildTable();
      }
    };

    Grid.prototype.buildTable = function () {
      this.addCheckboxColumn();
      this.buildHead();
      this._bindEvent();

      if (this.options.autoLoad && this.options.url !== '') {
        this.load(1);
      } else if (this.options.data) {
        this.buildBody();
      }
    };

    Grid.prototype.addCheckboxColumn = function () {
      if (this.options.checkbox) {
        var bulkMenu = $.dl.utils.template(this.options.template.bulkMenu, {template: this.bulkMenuHtml});
        this.options.colModel.unshift({
          display: '<input type="checkbox"/>' + bulkMenu,
          displayAlign: 'center',
          width: 80,
          name: 'checkbox',
          fix: true
        });
      }
    };

    Grid.prototype.buildHead = function () {
      var self = this,
        options = self.options,
        gLeft = self.gLeft,
        gRight = self.gRight,
        gContainer = self.gContainer,
        fixCol = [], col = [],
        leftWidth = 0;
      $.each(options.colModel, function (i, item) {
        if (item.fix) {
          fixCol.push(item);
        } else {
          col.push(item);
        }
      });
      $.each(fixCol, function (i, item) {
        var $cell = makeCell(item);
        gLeft.find('div.dl-grid-head-row').append($cell);
        leftWidth += $cell.outerWidth();
      });
      var bodyRightWidth = self.calcAndInitHideScrollWidth();
      gRight.css('margin-left', leftWidth);
      $.each(col, function (i, item) {
        item.width = self.cellWidthPercent ? Math.ceil(parseFloat(item.width) * 0.01 * bodyRightWidth) : parseInt(item.width);
        var $cell = makeCell(item);
        gRight.find('div.dl-grid-head-row').append($cell);
        self._bindColMoveEvent($cell);
      });

      if (options.height !== 'auto') {
        gContainer.find('.dl-grid-body').parent().height(options.height);
      }

      function makeCell(item) {
        var $cell = $(options.template.head.cell)
          .width(item.width)
          .css('text-align', item.headAlign)
          .html('<span>' + item.display + '</span>')
          .attr('name', item.name);
        if (item.sortable) {
          $cell.append($(options.template.head.sort)).addClass('sortable');
        }
        return $cell;
      }
    };

    Grid.prototype.buildBody = function () {
      var self = this,
        options = self.options;

      self.gRightBody.empty().width(self.calcRightBodyWidth());
      self.gLeftBody.empty();

      $.each(options.data.rows, function (i, item) {
        var $rowLeft = $(options.template.body.row).data('item', item).addClass('dl-row-' + i).data('rowIndex', i),
          $rowRight = $(options.template.body.row).addClass('dl-row-' + i).data('rowIndex', i);
        self.gRightBody.append($rowRight);
        if (options.colModel[0].fix) {
          self.gLeftBody.append($rowLeft);
        }

        for (var j = 0, l = options.colModel.length; j < l; j++) {
          var colModel = options.colModel[j],
            $cell = $(options.template.body.cell),
            $row = colModel.fix ? $rowLeft : $rowRight,
            content = '';
          $row.append($cell);
          $cell.css('text-align', item.bodyAlign);
          if (!self.cellContentDiff) {
            self.cellContentDiff = parseInt($cell.css('padding-left'), 10) * 2 + parseInt($cell.css('border-right-width'), 10);
          }
          if (colModel.name === 'checkbox') {
            content = '<input type="checkbox"/>';
          }
          else if (colModel.content) {
            content = $.dl.utils.template(colModel.content, item);
          } else if (colModel.name) {
            content = item[colModel.name];
          }
          $cell.children('.dl-grid-body-c-content').html(content).width(colModel.width - self.cellContentDiff);
        }
      });
      self.buildPage();
      self.buildColReSize();
      self.buildTreeNode();
    };

    Grid.prototype.buildPage = function () {
      if (!this.options.page.show) {
        return;
      }
      var self = this,
        options = self.options,
        pageInfo = {
          from: (options.data.page - 1) * options.page.PageSize + 1,
          to: options.data.page * options.page.PageSize,
          total: options.data.total,
          pageIndex: options.data.page,
          pageCount: Math.floor(options.data.total / options.page.PageSize)
        },

        prevCount = 3,
        start = 1,
        end = pageInfo.pageCount,
        gPage = $($.dl.utils.template(options.template.page, pageInfo)),
        $nextli = gPage.find('a.next').parent();

      pageInfo.can = {
        first: pageInfo.pageIndex > 1,
        prev: pageInfo.pageIndex > 1,
        last: pageInfo.pageIndex < pageInfo.pageCount,
        next: pageInfo.pageIndex < pageInfo.pageCount
      };
      if ((pageInfo.pageIndex - prevCount) > 3) {
        $nextli.before('<li><a>1</a></li>').before('<li><a>2</a></li>').before('<li><a>3</a></li>').before('<li><a class="disabled">...</a></li>');
        start = pageInfo.pageIndex - prevCount;
      }
      if ((pageInfo.pageIndex + prevCount) + 2 < end) {
        end = pageInfo.pageIndex + prevCount;
      }
      for (var i = start; i <= end; i++) {
        $nextli.before('<li><a>' + i + '</a></li>');
      }
      if (end !== pageInfo.pageCount) {
        $nextli.before('<li class="disabled"><a>...</a></li>').before('<li><a>' + (pageInfo.pageCount - 1) + '</a></li>').before('<li><a>' + pageInfo.pageCount + '</a></li>');
      }

      gPage.find('a').each(function () {
        var $this = $(this), $li = $this.parent(), c = $this.attr('class'), page = parseInt($this.text());
        $this.attr('page', page);
        if (page === pageInfo.pageIndex) {
          $li.addClass('active');
        }
        else if (c) {
          if (pageInfo.can[c] === false) {
            $li.addClass('disabled');
          }
        }
      });
      self.options.page.PageIndex = pageInfo.pageIndex;
      if (self.$grid.find('.dl-grid-page').length === 0) {
        bindEvent();
      }
      self.$grid.find('.dl-grid-page').remove().end().append(gPage);

      function bindEvent() {
        self.$grid.on('click', '.dl-grid-page a:not(.disabled)', function () {
          var $this = $(this), nPage = 0;
          if ($this.hasClass('first')) {
            nPage = 1;
          } else if ($this.hasClass('prev')) {
            nPage = pageInfo.pageIndex - 1;
          } else if ($this.hasClass('next')) {
            nPage = pageInfo.pageIndex + 1;
          } else if ($this.hasClass('last')) {
            nPage = pageInfo.pageCount;
          } else {
            nPage = parseInt($this.attr('page'));
          }
          self.load(nPage);
        });
        self.$grid.on('change', '.dl-grid-page select', function () {
          self.options.page.PageSize = parseInt($(this).val());
          self.load(1);
        });
      }
    };

    Grid.prototype.buildColReSize = function () {
      var self = this,
        options = self.options,
        colResize = $(options.template.colResize),
        gCells = self.gRightHead.children().eq(0).children(':visible'),
        scrollLeft = self.gRight.find('.hide-scroll:eq(0)').scrollLeft(),
        left = -scrollLeft,
        height = self.gRight.height();

      if (self.gRight.find('.dl-grid-colResize').length === 0) {
        self.gRight.prepend(colResize);
      }
      colResize = self.gRight.find('.dl-grid-colResize').empty().width(self.gRightHead.outerWidth());
      gCells.each(function () {
        var $cell = $(this), $drag = $('<div class="dl-grid-col-drag"></div>');
        colResize.append($drag);
        left += $cell.outerWidth();
        $drag.css({'left': left - $drag.outerWidth() / 2, 'height': height});
        self.bindColResizeEvent($drag);
      });
    };

    Grid.prototype.bindColResizeEvent = function ($drag) {
      var self = this;
      $drag.drag('start', function (e, info) {
        var $this = $(e.target).addClass('dragging'), index = $this.parent().children().index(e.target);
        info.cell = self.gRightHead.find('.dl-grid-head-cell').eq(index);
        info.oLeft = parseInt($this.css('left'), 10);
        info.n = index;
        info.oWidth = info.cell.outerWidth();
      }).drag(function (e, info) {
        var nLeft = info.oLeft + info.deltaX,
          nWidth = info.oWidth + info.deltaX;
        if (nWidth > self.options.cellMinWidth) {
          $(info.target).css('left', nLeft);
          info.cell.outerWidth(nWidth);
          info.nWidth = nWidth;
        }
      }).drag('end', function (e, info) {
        $(info.target).removeClass('dragging');
        self.gRightBody.width(self.calcRightBodyWidth()).children('.dl-grid-body-row').each(function (i, item) {
          var $bodyCell = $(item).children('.dl-grid-body-cell').eq(info.n);
          $bodyCell.children().outerWidth(info.nWidth - self.cellContentDiff);
        });
        self._moveGridHeadDrag();
        self.options.colModel[info.n].width = info.cell.outerWidth();
      });
    };

    Grid.prototype._moveGridHeadDrag = function () {
      var left = 0, gridColResize = this.gContainer.find('.dl-grid-colResize');
      this.gRightHead.find('.dl-grid-head-cell').each(function (i, item) {
        left += $(item).outerWidth();
        gridColResize.children().eq(i).css('left', left - 2.5);
      });
    };

    Grid.prototype.buildTreeNode = function () {
      var self = this,
        options = self.options,
        rows = self.options.data.rows,
        rowsLength = rows.length,
        leftIndex = 0,
        rightIndex = 0;
      $.each(options.colModel, function (i, item) {
        var colIndex = item.fix ? leftIndex++ : rightIndex++;
        if (item.treeNode) {
          var body = item.fix ? self.gLeftBody : self.gRightBody;
          body.find('.dl-grid-body-row').each(function (j) {
            var $row = $(this),
              $cell = $row.children().eq(colIndex),
              row = self.options.data.rows[j],
              treeNode = row.treeNode;
            $cell.addClass('dl-grid-body-tree dl-grid-body-node-p-' + (treeNode.split('-').length - 1)).attr('treeNode', treeNode);

            if (j < rowsLength - 1 && rows[j + 1].treeNode.indexOf(treeNode) >= 0) {
              $cell.addClass('dl-grid-body-node-parent').children('.dl-grid-body-c-content').prepend("<a class='dl-grid-body-node-toggle fa fa-minus-square'></a>");
            }
          });
        }
      });
    };

    Grid.prototype.calcRightBodyWidth = function () {
      var newTotalWidth = 0;//this.cellWidthPercent ? 0 : 0;
      this.gRightHead.find(".dl-grid-head-row:eq(0)").children(".dl-grid-head-cell").each(function () {
        newTotalWidth += $(this).outerWidth();
      });
      return newTotalWidth;
    };

    Grid.prototype.calcAndInitHideScrollWidth = function () {
      var self = this, rightBodyScrollWidth = 0, leftWidth = 0;
      if (self.options.width === 'auto') {
        rightBodyScrollWidth = this.$grid.width() - 2;
      }
      $.each(self.options.colModel, function (i, item) {
        if (item.fix) {
          leftWidth += item.width;
        }
      });
      rightBodyScrollWidth -= leftWidth;
      self.gRight.find('.hide-scroll').andSelf().width(rightBodyScrollWidth + 1);
      return rightBodyScrollWidth;
    };

    Grid.prototype._bindEvent = function () {
      var self = this;
      self.scroll.scroll(function () {
        var $this = $(this);
        self.gRightHead.parent().scrollLeft($this.scrollLeft());
        self.gLeftBody.parent().scrollTop($this.scrollTop());
        self.buildColReSize();
      });
      self.gRightHead.on('click', '.sortable', function () {
        var $this = $(this), $sorts = $this.find('.dl-grid-head-sort'), $asc = $sorts.find('.asc'), $desc = $sorts.find('.desc'), sort = '';
        if ($asc.css('visibility') !== 'hidden') {
          $asc.css('visibility', 'hidden');
          $desc.css('visibility', 'visible');
          sort = 'desc';
        } else {
          $asc.css('visibility', 'visible');
          $desc.css('visibility', 'hidden');
          sort = 'asc';
        }
        $this.siblings('.sortable').find('.dl-grid-head-sort').children().css('visibility', 'visible');
        self.options.page.OrderBy = $this.attr('name') + ' ' + sort;
        self.load();
      });
      //tree event
      self.gRightBody.on('click', 'a.dl-grid-body-node-toggle', function () {
        var $this = $(this),
          $cell = $this.closest('.dl-grid-body-cell'),
          isOpen = $this.hasClass('fa-minus-square'),
          treeNode = $cell.attr('treeNode'),
          $childRow = self.gRightBody.find('.dl-grid-body-cell[treeNode^=' + treeNode + '-]').parent();
        if (isOpen) {
          $this.removeClass('fa-minus-square').addClass('fa-plus-square');
          $childRow.each(function () {
            if ($(this).css('display') !== 'none') {
              $(this).hide().data('closedBy', treeNode);
            }
          });
        } else {
          $this.removeClass('fa-plus-square').addClass('fa-minus-square');
          $childRow.each(function () {
            if ($(this).data('closedBy') === treeNode) {
              $(this).show();
            }
          });
        }
      });
      self._bindCheckboxClickEvent();
    };

    Grid.prototype._bindCheckboxClickEvent = function () {
      var self = this;
      self.gLeftHead.on('click', 'input:checkbox', function () {
        var $checkbox = $(this),
          checked = $checkbox.is(':checked'),
          child = $checkbox.closest('div.dl-grid-head').next().find(':checkbox');
        child.prop('checked', checked);
        addSelecctClass();
      });
      self.gLeftBody.on('click', 'input:checkbox', function () {
        var $checkbox = $(this),
          body = $checkbox.closest('div.dl-grid-body'),
          checked = body.find(':checked').length === body.find(':checkbox').length;
        body.parent().prev().find(':checkbox').prop('checked', checked);
        addSelecctClass();
      });
      self.gLeftHead.on('click', 'a.select-all', function () {
        self.gLeft.find(':checkbox').prop('checked', true);
        addSelecctClass();
      });
      self.gLeftHead.on('click', 'a.select-empty', function () {
        self.gLeft.find(':checkbox').prop('checked', false);
        addSelecctClass();
      });
      self.gLeftHead.on('click', 'a.select-rev', function () {
        var allChecked = true, itemCheck;
        self.gLeftBody.find(':checkbox').each(function (i, item) {
          itemCheck = !$(item).prop('checked');
          allChecked &= itemCheck;
          $(item).prop('checked', itemCheck);
        });
        self.gLeftHead.find(':checkbox').prop('checked', allChecked);
        addSelecctClass();
      });
      function addSelecctClass() {
        self.gLeftBody.find(':checkbox').each(function (i, item) {
          var $this = $(item),
            row = $this.closest('div.dl-grid-body-row'),
            index = row.data('rowIndex'),
            bodyRow = self.gRightBody.find('div.dl-row-' + index);
          if ($this.prop('checked')) {
            row.addClass('selected');
            bodyRow.addClass('selected');
          } else {
            row.removeClass('selected');
            bodyRow.removeClass('selected');
          }
        });
      }
    };

    Grid.prototype._bindColMoveEvent = function ($cell) {
      var self = this;
      $cell.drag('start', function (e, info) {
        var $target = $(info.target), startleft = 0;
        self.gRightHead.find('.dl-grid-head-cell').each(function (i, item) {
          if (!$(item).is($target)) {
            startleft += $(item).outerWidth();
          } else {
            return false;
          }
        });
        $target.addClass('dragging').css('left', startleft);
        info.oLeft = startleft;
        info.n = self.gRightHead.find('.dl-grid-head-cell').index($(info.target));
        info.oPageX = e.pageX;
        info.$temp = $('<div></div>').width($target.outerWidth()).addClass('reorderWrap');
        $target.after(info.$temp);
      }, {distance: 5})
        .drag(function (e, info) {
          var $target = $(info.target),
            nLeft = info.oLeft + info.deltaX,
            direction = info.oPageX - e.pageX,
            targetWidth = $target.outerWidth(),
            nRight = targetWidth + nLeft,
            left = 0;
          if (nLeft >= 0) {
            $target.css('left', nLeft);
            self.gRightHead.find('.dl-grid-head-cell').each(function (i, item) {
              var $item = $(item), itemLeft = left, width = $item.outerWidth(), itemRight = width + itemLeft, find = false;
              if ($item.is($target)) {
                find = false;
              }
              if (direction > 0 && nLeft < (itemLeft + width / 2) && nLeft > itemLeft) {
                $item.before(info.$temp);
                find = true;
              }
              else if (direction < 0 && nRight > (itemLeft + width / 2) && nRight < itemRight) {
                $item.after(info.$temp);
                find = true;
              }
              if (find) {
                info.oPageX = e.pageX;
                return false;
              }
              left += width;
            });
          }
        }).drag('end', function (e, info) {
          var n = self.gRightHead.find('div.dl-grid-head-row').children().index(info.$temp);
          info.$temp.after($(info.target));
          $(info.target).css('left', 0).removeClass('dragging');
          info.$temp.remove();
          self._moveGridHeadDrag();
          if (info.n !== n) {
            self.gRightBody.find('div.dl-grid-body-row').each(function () {
              if (n - 1 >= 0) {
                $(this).children().eq(n - 1).after($(this).children().eq(info.n));
              }
              else {
                $(this).children().eq(n).before($(this).children().eq(info.n));
              }
            });
            var headCellNames = $.map(self.gRightHead.find('div.dl-grid-head-cell'), function (item) {
              return $(item).attr('name')
            });
            self.options.colModel = self.options.colModel.sort(function (a, b) {
              return headCellNames.indexOf(a.name) - headCellNames.indexOf(b.name);
            });
          }
        });
    };

    Grid.prototype.load = function (pageIndex) {
      var self = this,
        params = self.options.params;
      var param = {
        'PageIndex': pageIndex ? (self.options.page.PageIndex = pageIndex) : self.options.page.PageIndex,
        'PageSize': self.options.page.PageSize,
        'OrderBy': self.options.page.OrderBy
      };
      if (typeof params === 'function') {
        params = params();
      }
      if (params) {
        $.extend(param, params);
      }
      $http({
        method: 'GET',
        url: self.options.url,
        data: param
      }).success(function (data) {
        self.addData(data);
        self.compile = $compile(self.gContainer);
        if (self.options.onSuccess) {
          self.options.onSuccess();
        }
      }).error(function (data, status, headers, config) {
        if (self.options.onError) {
          self.options.onError(data, status, headers, config);
        }
      });
    };

    Grid.prototype.addData = function (data) {
      this.options.data = data;
      this.buildBody();
    };

    Grid.prototype.getData = function () {
      return this.options.data;
    };

    Grid.prototype.getSelectedItem = function () {
      var self = this, items = [];

      self.gLeftBody.find('div.dl-grid-body-row.selected').each(function () {
        items.push($(this).data('item'));
      });

      return items;
    };

    Grid.prototype.dispose = function () {
      this.gRight.find('div.dl-grid-col-drag').unbind('drag').unbind('dragstart').unbind('dragend');
      this.gRightHead.unbind('click');
      this.gRightBody.unbind('click');
    };

    return Grid;

  }]);
  angularAMD.directive('dlGrid', function ($window, $timeout, dlGridFactory) {
    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        var $element = $(element),
          gridConfig = scope[attrs.dlGrid],
          onSuccess = gridConfig.onSuccess,
          grid;

        gridConfig.onSuccess = function () {
          if (onSuccess) {
            onSuccess();
          }
          grid.compile(scope);
        };
        grid = new dlGridFactory($element, gridConfig);
        grid.init();

        scope.$on('dl.sideBarShowClose', function () {
          grid.calcAndInitHideScrollWidth();
        });

        $($window).on('resize.dlGrid', (function () {
          var timeoutPromise;

          function changeGridWidth() {
            $timeout.cancel(timeoutPromise);
            timeoutPromise = $timeout(function () {
              grid.calcAndInitHideScrollWidth();
            }, 100);
          }

          return changeGridWidth;
        })());

        gridConfig.grid = grid;

        scope.$on('$destroy', function () {
          $($window).off('resize.dlGrid');
          grid.dispose();
          $element = null;
          grid = null;
        });
      }
    };
  });
});


