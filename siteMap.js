/**
 * Created by cuong.nd on 2/5/15.
 */
require('./util');

Site = function () {
    this.siteMap = new HashMap();

    // EVA PAGE ================
    var evaObjectPost = new Object();
    evaObjectPost.keyDom = '<div><div class="div-baiviet">';
    evaObjectPost.queryRule = {
        'pathHtml' : true,
        'endHtml' :true
    };
    evaObjectPost.keyDelete = [];
    evaObjectPost.keyDelete.push('<div class="fb-like fb_iframe_widget"');
    evaObjectPost.keyDelete.push('<div class="thong-diep-mxh"');
    evaObjectPost.keyDelete.push('<div class="baiviet-bailienquan">');
    evaObjectPost.keyDelete.push('<div class="baiviet-tags">');

    this.siteMap.put('http://eva.vn', evaObjectPost);
};


