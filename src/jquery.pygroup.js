/********************************************
* 名称:根据字母数据分组插件            
* 描述:把汉字按照拼音首字母排序，分组显示                          
* 创建日期:2013-12-20           
* 最后修改日期:2014-07-17                              
* 作者:ZJH                       
********************************************/
(function ($) {
    $.fn.pygroup = function (option) {
		var opts = $.extend({}, $.fn.pygroup.Defaults, option);
        $.each($(this), Tab);

		
        function Tab() {
            var $this = $(this),
            $tabDiv = null,
            $tabSearch = null,
            $tabContent = null,
            arrHtml = [];

            $tabDiv = BuildTabDiv();
            $tabSearch = BuildSearchList();
            $tabContent = BuildContent();
            SetStyle();
            BindEvents();

            function BuildTabDiv() {
                var tabId = GetRandomId(),
                    offset = $this.offset();
                arrHtml.push('<div class="tab_TabDiv" id="tab_' + tabId + '">');
                arrHtml.push('<div class="tab_DivHead"><span class="tab_Title">' + opts.Title + '</span><span class="tab_btnClose" title="关闭"></span>&nbsp;[<span class="tab_clear">清空</span>]</div>');
                arrHtml.push('<div class="tab_SearchDiv"></div>');
                arrHtml.push('<div class="tab_Clear"></div>');
                arrHtml.push('<div class="tab_divContent"></div>');
                arrHtml.push('</div>');
                $this.addClass("tab_txt").after(arrHtml.join(''));
                return $("#tab_" + tabId).offset({ top: offset.top + $this.height() + 5, left: offset.left });
            }
            //选择框
            function BuildSearchList() {
                var arrSearch = opts.Tab,
                arrSearchHtml = [];
                arrSearchHtml.push('<ul class="tab_SearchList">');
                $.each(arrSearch, function (i, searchItem) {
                    if (i == 0) {
                        arrSearchHtml.push('<li index="' + i + '" class="tab_ActiveSearch">');
                    }
                    else {
                        arrSearchHtml.push('<li index="' + i + '">');
                    }
                    arrSearchHtml.push(searchItem);
                    arrSearchHtml.push('</li>');
                });
                arrSearchHtml.push('</ul>');
                return $tabDiv.children(".tab_SearchDiv").html(arrSearchHtml.join(''));
            }

            //数据框
            function BuildContent() {
                var arrSearch = opts.Tab,
                jsonContent = opts.Content,
                arrContentHtml = [];
                $.each(arrSearch, function (i, searchItem) {
                    var arrContentItem = jsonContent[searchItem];
                    if (i == 0) {
                        arrContentHtml.push('<ul class="tab_ContentList tab_ActiveContent" index="' + i + '">');
                    }
                    else {
                        arrContentHtml.push('<ul class="tab_ContentList" index="' + i + '">');
                    }
                    if (arrContentItem != undefined) {
                        $.each(arrContentItem, function (j, jsonItem) {
                            var text = jsonItem.text,
                                value = jsonItem.value;
                            arrContentHtml.push('<li title="' + text + '" val="' + value + '">' + text + '</li>');
                        });
                    }
                    arrContentHtml.push('</ul>');
                });
                return $tabDiv.children(".tab_divContent").html(arrContentHtml.join(''));
            }

            //改变样式
            function SetStyle() {
                $tabContent.css({ "scrollbarTrackColor": "rgb(232,240,246)" });
                if (opts.ReadOnly) {
                    $this.attr("readonly", opts.ReadOnly).keydown(function (event) {
                        if (event.keyCode == "8") {
                            event.preventDefault();
                        }
                    });
                }
            }

            //绑定事件
            function BindEvents() {
                $tabSearch.find("li").bind("click.tab", Tab_SearchListClick);
                $tabDiv.find(".tab_btnClose").bind("click.tab", Tab_Close).end().find(".tab_clear").bind("click", Tab_Clear);
                $tabContent.find("li").bind("click.tab", Tab_DataPick);
                $this.bind("blur.tab", Tab_Close).bind("click.tab", Tab_InputClick).bind("change", opts.OnTxtChange).bind("keyup", function () {
                    if ($(this).val().replace(/(^\s*)|(\s*$)/g, "") === "") {
                        $(this).attr("txtVal", "");
                    }
                });
                $tabDiv.bind("mouseout", function () {
                    $this.bind("blur.tab", Tab_Close);
                }).bind("mouseover", function () {
                    $this.unbind("blur.tab");
                });
            }

            //获得随机id号
            function GetRandomId() {
                return new Date().getTime() + (Math.random() * 10000).toFixed(0);
            }

            //点击选择列表项
            function Tab_SearchListClick() {
                $tabSearch.children("ul").children("li").removeClass("tab_ActiveSearch");
                $(this).addClass("tab_ActiveSearch");

                var index = $(this).attr("index");
                $tabContent.children("ul").each(function () {
                    if ($(this).attr("index") == index) {
                        $(this).addClass("tab_ActiveContent").siblings("ul").removeClass("tab_ActiveContent");
                    }
                });

                $this.focus().val($this.val());
            }

            //点击文本框
            function Tab_InputClick() {
                Tab_Show();
                SetSelectedContentStyle();
            }

            //关闭
            function Tab_Close(objTab) {
                $tabDiv.hide();
            }

            //显示
            function Tab_Show() {
                $(".tab_TabDiv").not($tabDiv).hide();
                $tabDiv.show();
            }

            //清空
            function Tab_Clear() {
                $this.val("").attr("txtVal", "").trigger("focus");
                SetSelectedContentStyle();
            }

            //点击内容数据
            function Tab_DataPick() {
                var text = $(this).text(),
                    value = $(this).attr("val").replace(/(^\s*)|(\s*$)/g, "") + "",
                    inputVal = $this.val(),
                    inputTxtVal = $this.attr("txtVal") || "";
                if (!$(this).hasClass("tab_ContentSelected")) {
                    //单选
                    if (!opts.MultiChoice) {
                        $this.val(text).attr("txtVal", ("" + value));
                        Tab_Close();
                    }
                    //多选
                    else {
                        $this.val(inputVal + (inputVal === "" ? "" : opts.Separator) + text).attr("txtVal", (inputTxtVal + (inputTxtVal === "" ? "" : opts.Separator) + value));
                    }
                    SetSelectedContentStyle();
                    if (opts.OnTxtChange != null) {
                        opts.OnTxtChange();
                    }
                }
            } 
 
            //设置已选的值的样式
            function SetSelectedContentStyle() {
                var txtVal = ($this.attr("txtVal") || "").replace(/(^\s*)|(\s*$)/g, "");
                var arrSelected = txtVal.split(opts.Separator);
                $tabContent.find("li.tab_ContentSelected").removeClass("tab_ContentSelected");
                $.each(arrSelected, function (i, val) {
                    $tabContent.find("li[val=" + val.replace(/(^\s*)|(\s*$)/g, "") + "]").addClass("tab_ContentSelected");
                })
            }
        }
    }  

    $.fn.pygroup.Defaults = {
        Title: "Hello World",
        ReadOnly: false,     //只读
        MultiChoice: false,  //多选
        Separator: ",",      //多个值之间的分隔符
        Tab: ["A-E", "F-J", "K-O", "P-T", "U-Z"],
        Content:
        { "A-E": [{ "text": "一啦啦", "value": "1" }, { "text": "二啦啦", "value": "2" }, { "text": "三啦啦", "value": "3"}],
            "F-J": [{ "text": "四啦啦", "value": "4" }, { "text": "五啦啦", "value": "5" }, { "text": "六啦啦", "value": "6"}],
            "K-O": [{ "text": "七啦啦", "value": "7" }, { "text": "八啦啦", "value": "8" }, { "text": "九啦啦", "value": "9"}]
        },
        OnTxtChange: function () { }

    }
} (jQuery));