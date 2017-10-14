// 地图对象
var map = null;

$(function () {
    /*百度地图*/
    map = new BMap.Map("map", {enableMapClick: false});//构造底图时，关闭底图可点功能
    var point = new BMap.Point(107.812559, 26.708509); // 创建点坐标
    map.centerAndZoom(point, 12); // 初始化地图,设置中心点坐标和地图级别。
    //map.disableScrollWheelZoom(); // 禁用滚轮放大缩小
    map.enableDoubleClickZoom();// 启用双击放大，默认启用
    //map.disableDoubleClickZoom(); // 禁用双击放大
    map.enableScrollWheelZoom(true);//启用滚轮放大缩小，默认禁用
//    map.setDispalyOnMaxLevel(18); // 地图允许展示的最大级别
//    map.setDisplayOnMinLevel(10); // 地图允许展示的最小级别

    getBoundary('凯里市');// 创建凯里市的行政区域

    //	地图移动结束时触发此事件
    map.addEventListener("moveend", function (e) {
        // 地理区域范围,
        getBounds();
    });

    //地图更改缩放级别结束时触发触发此事件
    map.addEventListener("zoomend", function (e) {
        // 地理区域范围
        getBounds();
        var zoom = map.getZoom();
        if (zoom > 18) {
            layer.msg('地图已到最大级');
            return map.setZoom(18);
        } else if (zoom < 10) {
            layer.msg('地图已到最小限制');
            return map.setZoom(10);
        }
    });

    //	地图更改缩放级别开始时触发触发此事件
    map.addEventListener("zoomstart", function (e) {
    });

});




/**
 * 创建行政区域
 * @param {type} name
 * @returns {undefined}
 */
function getBoundary(name) {

    if (name) {
        name = '凯里市';
    }
    var bdary = new BMap.Boundary();
    bdary.get(name, function (rs) {       //获取行政区域
        var count = rs.boundaries.length; //行政区域的点有多少个
        for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 5, strokeColor: "#021afc", setFillOpacity: 0, fillColor: 'none'}); //建立多边形覆盖物
            map.addOverlay(ply);  //添加覆盖物
            // map.setViewport(ply.getPath());//调整视野         
        }
    });
}


/**
 * 缩放地图
 * @returns {undefined}
 */
function ScaleZoom(scale) {

    var zoom = map.getZoom();
    var num = zoom + scale;
    if (num >= 18) {
        layer.msg('地图已到最大级');
    } else if (num <= 10) {
        layer.msg('地图已到最小限制');
    } else {
        map.setZoom(num);
    }
}

/**
 * 地理区域范围
 * longitude = lng = 经度
 * latitude = lat = 纬度
 * @returns {undefined}
 */
function getBounds() {

    if (is_search) {
        var bs = map.getBounds();   //获取可视区域
        var bssw = bs.getSouthWest();   //可视区域左下角
        var bsne = bs.getNorthEast();   //可视区域右上角

        param.left_top = {longitude: bssw.lng, latitude: bssw.lat};
        param.right_bottom = {longitude: bsne.lng, latitude: bsne.lat};

        // 调用查询
        if (getList) {
            getList();
        }
    }
}

/**
 * 设置地图中心
 * @param {type} zoom_name 城市名称
 * @param {type} zoom 地图放大级别
 * @returns {undefined}
 */
function centerAndZoom(zoom_name, zoom) {
    
    map.centerAndZoom(zoom_name, zoom);
}

