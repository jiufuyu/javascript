var Common = function() {
    this.input = 'input';
    this.mySkin = 'layui-layer-lan';
    this.index = '';
    this.area = 'area';
    this.delMsgTxt = '您确定要删除吗？';
    this.iconType = 3;
    this.offset = 0;
    this.shift = 6;
    this.requestError = '请求出现异常!';
    this.batchEditTxt = '批量编辑';
    this.borderSkin = 'layui-layer-rim';
    this.layer = layer;
    this.tmpDataArray = new Array();
}
Common.prototype = {
    init: function() {
        that = this
        $(".datepicker").datepicker();
        jQuery(function($) {
            $.datepicker.regional['zh-CN'] = {
                closeText: '关闭',
                prevText: '<上月',
                nextText: '下月>',
                currentText: '今天',
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
                dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
                weekHeader: '周',
                dateFormat: 'yy-mm-dd',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: true,
                yearSuffix: '年'
            };
            $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
        });
    },
    selectEvent: function(all, unCheck, thecheck, area, input) {
        var that = this;
        this.area = area;
        var CheckAll = document.getElementById(all);
        var UnCheck = document.getElementById(unCheck);
        var OtherCheck = document.getElementById(thecheck);
        var div = document.getElementById(area);
        var inputTag = input ? input : that.input;
        var CheckBox = div.getElementsByTagName(inputTag);
        CheckAll.onclick = function() {
            for (i = 0; i < CheckBox.length; i++) {
                CheckBox[i].checked = true;
            };
        };
        UnCheck.onclick = function() {
            for (i = 0; i < CheckBox.length; i++) {
                CheckBox[i].checked = false;
            };
        };
        OtherCheck.onclick = function() {
            for (i = 0; i < CheckBox.length; i++) {
                if (CheckBox[i].checked == true) {
                    CheckBox[i].checked = false;
                } else {
                    CheckBox[i].checked = true
                }
            };
        };
    },
    showmsgEvent: function(res, ifParent) {
        if (typeof res != 'object') {
            res = eval('(' + res + ')');
        }
        //alert(ifParent)
        if (res.msg) {
            this.alertEvent(res.msg, res.type);
            if (res.url) {
                this.hrefEvent(res, ifParent);
            } else {
                this.alertEvent(res.msg, res.type);
            }
        } else {
            this.hrefEvent(res, ifParent);
        }
    },
    hrefEvent: function(res, ifParent) {
        ifParent = ifParent ? ifParent : "parent";
        if (res.url !== 'reload' && res.url) {
            setTimeout(function() {
                if (ifParent == 'parent') {
                    parent.window.location.href = res.url;
                } else {
                    window.location.href = res.url;
                }
            }, res.timer);
        } else {
            //alert(ifParent)
            setTimeout(function() {
                if (ifParent == 'parent') {
                    parent.window.location.reload();
                } else {
                    window.location.reload();
                }
            }, res.timer);
        }
    },
    alertEvent: function(msg, type) {
        //alert(msg)
        if (type) {
            ty = type;
        } else {
            ty = this.iconType;
        }
        this.layer.msg(msg, {
            icon: ty
                //offset: this.offset,
        });
    },
    deleteEvent: function(obj, getData) {
        var that = this;
        that.layer.confirm(that.delMsgTxt, {
            skin: that.mySkin,
            closeBtn: 0,
            shade: false,
            title: false,
            icon: this.iconType,
            shift: 1
        }, function(index) {
            $.get(obj, {
                data: getData
            }, function(res) {
                that.showmsgEvent(res);
            })
        });
    },
    noSelectEvent: function(area) {
        var IdArray = new Array();
        area = area ? area : this.area;
        var IdArea = $("#" + area);
        var tmp = '';
        var i = 0;
        IdArea.find('input[name="items[]"]:checked').each(function() {
            IdArray[i] = $(this).val();
            i++;
        });
        //alert(IdArray)
        if (IdArray.length <= 0) {
            this.alertEvent('请先选择要操作的列', 2);
            return false;
        }
        return IdArray;
    },
    batchDeleteEvent: function(url) {
        IdArray = this.noSelectEvent();
        if (!IdArray) {
            return;
        }
        this.deleteEvent(url, IdArray);
    },
    batchEditEvent: function(url) {
        var that = this;
        IdArray = this.noSelectEvent();
        if (!IdArray) {
            return;
        }
        this.index = parent.layer.getFrameIndex(window.name);
        that.layer.open({
            type: 2,
            skin: that.borderSkin,
            title: that.batchEditTxt,
            area: ['700px', '530px'],
            fix: false, //不固定
            content: url + "?data=" + IdArray
        });
    },
    layerFormEvent: function(res) {
        if (res) {
            this.showmsgEvent(res, 'parent');
        }
    },
    ajaxEditEvent: function(obj) {
        var input = '';
        var spanHtml = '';
        var spanUrl = '';
        $('.itemSpan').bind('click', function() {
            spanHtml = $(this).html();
            spanUrl = $(this).attr('url');
            var spanUrlObj = eval('(' + spanUrl + ')');
            if (!spanUrlObj) {
                return;
            }
            common.tmpDataArray[spanUrlObj.arg] = spanHtml;
            input = '<div  class="form-inline">' + '<input type="text" onkeyup="common.changeEvent(this)" class="form-control" url = "' + spanUrl + '"  value=' + spanHtml + ' >' + '<div class="input-group"><button onclick="common.getEditEvent(this)" disabled class="btn btn-default">确定</button><a  onclick="common.cancelEvent(this)" class="btn btn-link">取消</a></div></div>';
            $(this).parent().html(input);
        });
    },
    changeEvent: function(obj) {
        var inputUrlObj = eval('(' + $(obj).attr('url') + ')');
        if (!inputUrlObj) {
            return;
        }
        if ($(obj).val() !== common.tmpDataArray[inputUrlObj.arg]) {
            $(obj).next().children('button').removeAttr('disabled');
        } else {
            $(obj).next().children('button').attr('disabled', 'disabled');
        }
    },
    getEditEvent: function(obj) {
        var SureParentObj = $(obj).parent();
        var surespanUrl = SureParentObj.prev().attr('url');
        var SureUrlObj = eval('(' + surespanUrl + ')');
        if (!SureUrlObj) {
            return;
        }
        var getData = SureParentObj.prev().val();
        if (!SureUrlObj.arg) {
            return;
        }
        if (common.tmpDataArray[SureUrlObj.arg] == getData) {
            /*disabled*/
            common.cancelEvent(obj);
            return;
        }
        $.ajax({
            url: SureUrlObj.url + SureUrlObj.arg,
            data: {
                data: getData,
                area: SureUrlObj.index
            },
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function(res) {
                SureParentObj.parent().parent().html('<span url = "' + surespanUrl + '" style="cursor: pointer"  class="itemSpan" >' + SureParentObj.prev().val() + '</span>');
                common.showmsgEvent(res);
                common.ajaxEditEvent();
                return;
            },
            error: function() {
                common.alertEvent(common.requestError, 2);
                return;
            }
        });
    },
    cancelEvent: function(obj) {
        var parentObj = $(obj).parent();
        var cancelspanUrl = parentObj.prev().attr('url');
        parentObj.parent().parent().html('<span  url = "' + cancelspanUrl + '" style="cursor: pointer"   class="itemSpan" >' + parentObj.prev().val() + '</span>');
        common.ajaxEditEvent();
        return;
    }
};
var common = new Common();
common.ajaxEditEvent();