import Mock from 'mockjs';


const Random = Mock.Random;
Mock.setup({
  timeout:'200-400',
})
const allData = Mock.mock({
  'list|1000': [{
    'id|+1': 1,
    'name': '@cname',
    'dia|10-100': 1,
    'img': 'https://picsum.photos/@integer(0,500)',
    'ava': 'https://picsum.photos/@integer(0,500)',
    'video': 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
    'title': '@ctitle(15)',
    'meTitle': '@ctitle',
    'isVideo':'@boolean'
  }]
}).list
Mock.mock(/\/api\/users\/page/, 'get', function(options) {

  const query = options.url.split('?')[1]
  const params = new URLSearchParams(query)
  const pageNum = parseInt(params.get('pageNum')) || 1
  const pageSize = parseInt(params.get('pageSize')) || 10
  

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const pageData = allData.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      pageNum,
      pageSize,
      total: allData.length,
      pages: Math.ceil(allData.length / pageSize),
      list: pageData
    }
  }
})
