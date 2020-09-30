# PlayerEndpoint comparison between KMS6 and 7

<table>
<thead>
<tr>
<th></th>
<th>KMS6</th>
<th>KMS7</th>
</tr>
</thead>
<tbody>
<tr>
<th></th>
<td>

![aa](./images/kms6-example.gif)

</td>
<td>

![aa](./images/kms7-example.gif)

</td>
</tr>
<tr>
<th>Error log</th>
<td>

```
0:04:19.223950365  1381 0x7f8148090770 ERROR                  libav :0:: no frame!
0:04:19.223962425  1381 0x7f8148090770 WARN                   libav gstavviddec.c:1528:gst_ffmpegviddec_frame:<avdec_h264-0> avdec_h264: decoding error (len: -1094995529, have_data: 0)
0:04:19.724015901  1381 0x7f8148090770 ERROR                  libav :0:: no frame!
0:04:19.724028656  1381 0x7f8148090770 WARN                   libav gstavviddec.c:1528:gst_ffmpegviddec_frame:<avdec_h264-0> avdec_h264: decoding error (len: -1094995529, have_data: 0)
```

</td>
<td>

```
0:04:19.798065219  1246 0x7fad4400e0f0 ERROR                  libav :0:: no frame!
0:04:19.798081648  1246 0x7fad4400e0f0 WARN                   libav gstavviddec.c:1751:gst_ffmpegviddec_frame:<avdec_h264-0> avdec_h264: decoding error (len: -1094995529, have_data: 0)
0:04:19.848197348  1246 0x7fad4400e0f0 ERROR                  libav :0:: no frame!
0:04:19.848259666  1246 0x7fad4400e0f0 WARN                   libav gstavviddec.c:1751:gst_ffmpegviddec_frame:<avdec_h264-0> avdec_h264: decoding error (len: -1094995529, have_data: 0)
```

</td>
</tr>
</tbody>
</table>
