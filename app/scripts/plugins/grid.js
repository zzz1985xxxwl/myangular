define(['util'], function () {
  'use strict';
  var Grid = function ($this, options) {
    this.$grid = $this;
    this.options = $.extend({}, Grid.DEFAULTS, options);
    this.options.page.OrderBy = this.options.orderBy;
  };

  Grid.DEFAULTS = {
    url: '',
    orderBy: '',
    params: {},
    data: null,//{rows:[],page:1,total:100}
    colModel: [],//{ display: '列1', headAlign: 'center', bodyAlign:'left',name: 'Col1', sortable: true, treeNode: true,fix:true},
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
      page: '<div class="dl-grid-page"><div class="info">显示<b>{{from}}</b>到<b>{{to}}</b>,共<b>{{total}}</b>条</div><ul class="pagination">' +
      '<li><a class="first">&laquo;</a></li><li><a class="prev">&lt;</a></li><li><a class="next">&gt;</a></li>' +
      '<li><a class="last">&raquo;</a></li></ul></div>',
      colResize: '<div class="dl-grid-colResize"></div>'
    }
  };

  Grid.prototype.init = function () {
    var options = this.options;
    this.gLeft = $(options.template.gLeft);
    this.gRight = $(options.template.gRight);
    this.gContainer = $(options.template.gContainer);
    this.gLeftBody = this.gLeft.find('.dl-grid-body');
    this.gRightBody = this.gRight.find('.dl-grid-body');
    this.gRightHead = this.gRight.find('.dl-grid-head');
    this.gLeftHead = this.gLeft.find('.dl-grid-head');
    this.scroll = this.gRight.find("div.scroll");

    var lastItem = this.options.colModel[this.options.colModel.length - 1];
    this.cellWidthPercent = typeof lastItem.width === "string" && lastItem.width.indexOf('%') > 0;
    this.$grid.append(
      this.gContainer.append(this.gLeft).append(this.gRight)
    ).addClass('dl-grid');

    if (options.width === 'auto') {
      options.width = this.$grid.width() - 2;
    }
    this.buildTable();
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
      this.options.colModel.unshift({
        display: '<input type="checkbox"/><a class="fa fa-edit"></a>',
        displayAlign: 'center',
        width:50,
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
      gLeft.find("div.dl-grid-head-row").append($cell);
      leftWidth += $cell.outerWidth();
    });
    options.width -= leftWidth;
    gRight.find('.hide-scroll').andSelf().width(options.width + 1);
    gRight.css('margin-left', leftWidth);
    $.each(col, function (i, item) {
      item.width = self.cellWidthPercent ? Math.ceil(parseFloat(item.width) * 0.01 * (options.width)) : item.width;
      gRight.find('div.dl-grid-head-row').append(makeCell(item));
    });

    if (options.height !== 'auto') {
      gContainer.find(".dl-grid-body").parent().height(options.height);
    }

    function makeCell(item) {
      var $cell = $(options.template.head.cell)
        .width(item.width)
        .css("text-align", item.headAlign)
        .html('<span>' + item.display + '</span>')
        .attr("name", item.name);
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
      var $rowLeft = $(options.template.body.row).data("item", item),
        $rowRight = $(options.template.body.row).data("item", item);
      self.gRightBody.append($rowRight);
      if (options.colModel[0].fix) {
        self.gLeftBody.append($rowLeft);
      }

      for (var j = 0, l = options.colModel.length; j < l; j++) {
        var colModel = options.colModel[j],
          $cell = $(options.template.body.cell),
          $row = colModel.fix ? $rowLeft : $rowRight,
          content='';
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
        } else if(colModel.name){
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
      $nextli = gPage.find("a.next").parent();

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
      $nextli.before("<li><a>" + i + "</a></li>");
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
          nPage = parseInt($this.attr("page"));
        }
        self.load(nPage);
      });
    }
  };

  Grid.prototype.buildColReSize = function () {
    var self = this,
      options = self.options,
      colResize = $(options.template.colResize),
      gCells = self.gRightHead.children().eq(0).children(":visible"),
      scrollLeft = self.gRight.find('.hide-scroll:eq(0)').scrollLeft(),
      left = -scrollLeft,
      height = self.gRight.height();

    if (self.gRight.find('.dl-grid-colResize').length === 0) {
      self.gRight.prepend(colResize);
      self.bindColResizeEvent();
    }

    colResize = self.gRight.find('.dl-grid-colResize').empty().width(self.gRightHead.outerWidth());

    gCells.each(function () {
      var $cell = $(this), $drag = $('<div class="dl-grid-col-drag"></div>');
      colResize.append($drag);
      left += $cell.outerWidth();
      $drag.css({"left": left - $drag.outerWidth() / 2, "height": height});
    });
  };

  Grid.prototype.bindColResizeEvent = function () {
    var info, $document = $(document);
    $document.on('mousedown', 'div.dl-grid-col-drag', function (e) {
      var $this = $(e.target), grid = $this.closest('.dl-grid').data("dl.Grid"), index = $this.parent().children().index(e.target);
      info = {
        startX: e.pageX,
        target: $this,
        cell: grid.gRightHead.find('.dl-grid-head-cell').eq(index),
        oLeft: parseInt($this.css("left"), 10),
        n: index,
        diff: 0
      };
      info.oWidth = info.cell.outerWidth();
      mouseMove(grid);
      mouseUp(grid);
    });
    function mouseUp(grid) {
      $document.on('mouseup.GridResize', function () {
        $document.unbind('mousemove.GridResize');
        $document.unbind('mouseup.GridResize');
        grid.gRightBody.width(grid.calcRightBodyWidth()).children('.dl-grid-body-row').each(function (i, item) {
          var $bodyCell = $(item).children('.dl-grid-body-cell').eq(info.n);
          $bodyCell.children().outerWidth(info.nWidth - grid.cellContentDiff);
        });
        var left = 0;
        grid.gRightHead.find('.dl-grid-head-cell').each(function (i, item) {
          left += $(item).outerWidth();
          info.target.parent().children().eq(i).css('left', left - 2.5);
        });
        grid.options.colModel[info.n].width = info.cell.outerWidth();
      });
    }

    function mouseMove(grid) {
      $document.on('mousemove.GridResize', function (e) {
        var diff = e.pageX - info.startX,
          nLeft = info.oLeft + diff,
          nWidth = info.oWidth + diff;
        if (nWidth > grid.options.cellMinWidth) {
          info.target.css('left', nLeft);
          info.cell.outerWidth(nWidth);
          info.nWidth = nWidth;
          info.diff = diff;
        }
      });
    }

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
      if ($asc.css('visibility') !== "hidden") {
        $asc.css('visibility', 'hidden');
        $desc.css('visibility', 'visible');
        sort = 'desc';
      } else {
        $asc.css('visibility', 'visible');
        $desc.css('visibility', 'hidden');
        sort = 'asc';
      }
      $this.siblings('.sortable').find('.dl-grid-head-sort').children().css('visibility', 'visible');
      self.options.page.OrderBy = $this.attr("name") + ' ' + sort;
      self.load();
    });
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
    self.gLeftHead.on('click', 'input:checkbox', function () {
      var $checkbox = $(this),
        checked = $checkbox.is(':checked'),
        child = $checkbox.closest('div.dl-grid-head').next().find(':checkbox');
      child.prop('checked', checked);
    });
    self.gLeftBody.on('click','input:checkbox',function(){
      var $checkbox = $(this),
        body = $checkbox.closest('div.dl-grid-body'),
        checked = body.find(':checked').length===body.find(':checkbox').length;
      body.parent().prev().find(':checkbox').prop('checked', checked);
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
    if (typeof params === "function") {
      params = params();
    }
    if (params) {
      $.extend(param, params);
    }
    $.ajax({
      type: 'get',
      url: self.options.url,
      data: param,
      dataType: 'json',
      success: function (data) {
        self.addData(data);
        if (self.options.onSuccess) {
          self.options.onSuccess();
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        try {
          if (self.options.onError) {
            self.options.onError(XMLHttpRequest, textStatus, errorThrown);
          }
        } catch (e) {
        }
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

  function Plugin(option, args) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('dl.Grid');
      if (!data) {
        $this.data('dl.Grid', (data = new Grid($this, option)));
        data.init();
      }
      if (typeof option === 'string') {
        data[option].call(data, args);
      }
    });
  }

  var old = $.fn.Grid;

  $.fn.Grid = Plugin;


  // Grid NO CONFLICT
  // =================
  $.fn.Grid.noConflict = function () {
    $.fn.Grid = old;
    return this;
  };
});


