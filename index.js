const express = require('express');
const fileUpload = require('express-fileupload');
const { parseKml } = require('./index');

const app = express();
const port = 3000;

// 默认选项，将文件上传到内存中
app.use(fileUpload());

app.post('/upload', (req, res) => {
  if (!req.files || !req.files.kmlFile) {
    return res.status(400).send('No files were uploaded.');
  }

  // 从请求中获取上传的文件
  const kmlFile = req.files.kmlFile;

  // 临时保存文件到服务器
  const tempPath = __dirname + '/uploads/' + kmlFile.name;
  kmlFile.mv(tempPath, (err) => {
    if (err) return res.status(500).send(err);

    // 使用 parseKml 函数处理文件
    parseKml(tempPath)
      .then(data => {
        // 发送解析后的数据作为响应
        res.send(data);
      })
      .catch(error => {
        console.error(error);
        res.status(500).send(error.message);
      });
  });
});

app.listen(port, () => {
  console.log(`GeoDataVisualizer API listening at http://localhost:${port}`);
});

