import request from "../utils/request"

export default {
    // 主要作用带ID的单条数据处理，如：单条查，单条删除。
    // 数据类型：
        // ApiUrl: String, 
        // methodType: String, 
        // SupData: String
    // 需要传{ApiUrl：请求URL, methodType: 请求类型(目前这里只请求get), id: 数据的唯一ID}
    SupportDataById(ApiUrl, methodType, id) {
        return request ({
            url: `${ApiUrl}/${id}`,
            method: methodType,
            headers: {
                'X-CSRFToken': localStorage.getItem('token')
            }
        })
    },
    // 此处只为了查找登录用户的信息
    SupportGetData(ApiUrl, methodType) {
        return request ({
            url: `${ApiUrl}`,
            method: methodType,
            headers: {
                'X-CSRFToken': localStorage.getItem('token')
            }
        })
    },

    // 主要更新数据.
    // 数据类型：
        // ApiUrl: String, 
        // methodType: String, 
        // SupData: Dict
    // 需要传{ApiUrl：请求URL, methodType: 请求类型(目前这里只请求Put), SupData: 更新的数据}
    // 因为更新数据时需要向后台发送更新哪一条数据，此处SupData中带有ID，所以目前单独用一个接口来用。
    SupportPutData(ApiUrl, methodType, SupData) {
        return request({
            url: `${ApiUrl}/${SupData.id}`,
            method: methodType,
            data: SupData,
            headers: {
                'X-CSRFToken': localStorage.getItem('token')
            }
        })
    },
    // 主要是添加数据和分页查询数据，发送Post请求
    // 数据类型：
        // ApiUrl: String, 
        // methodType: String, 
        // SupData: Dict
    // 需要传{ApiUrl：请求URL, methodType: 请求类型, SupData: 传参数据}
    SupportPostData(ApiUrl, methodType, SupData) {
        return request ({
            url: ApiUrl,
            method: methodType,
            data: SupData,
            headers: {
                'X-CSRFToken': localStorage.getItem('token')
            }
        })
    },
    SupportPutLinkData(ApiUrl, methodType, SupData, id) {
        return request({
            url: `${ApiUrl}/${id}`,
            method: methodType,
            data: SupData,
            headers: {
                'X-CSRFToken': localStorage.getItem('token')
            }
        })
    }
}
