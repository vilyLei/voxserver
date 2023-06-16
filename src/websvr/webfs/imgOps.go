package webfs

import (
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"strings"
)

func ResizeImgAndSave(imgDir string, imgName string, pw int, ph int) {
	// "./color_02.jpg"
	parts := strings.Split(imgName, ".")
	suffix := parts[len(parts)-1]
	suffix = strings.ToLower(suffix)

	imgFilePath := imgDir + imgName
	// 打开图像文件
	file, err := os.Open(imgFilePath)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	// 解码图像文件
	img, _, err := image.Decode(file)
	if err != nil {
		panic(err)
	}

	// 缩小图像
	smallImg := resize(img, pw, ph)
	if suffix == "png" {

		// 创建 PNG 图像文件
		out, err := os.Create(imgDir + parts[0] + "_" + "mini.png")
		if err != nil {
			panic(err)
		}
		defer out.Close()

		// 保存为 PNG 格式
		err = png.Encode(out, smallImg)
		if err != nil {
			panic(err)
		}
	} else {
		// 创建 JPEG 图像文件
		out, err := os.Create(imgDir + parts[0] + "_" + "mini.jpg")
		if err != nil {
			panic(err)
		}
		defer out.Close()

		// 保存为 JPEG 格式
		err = jpeg.Encode(out, smallImg, &jpeg.Options{Quality: 90})
		if err != nil {
			panic(err)
		}
	}

}

// 缩小图像
func resize(img image.Image, width, height int) image.Image {
	bounds := img.Bounds()
	xScale := float64(bounds.Dx()) / float64(width)
	yScale := float64(bounds.Dy()) / float64(height)
	scale := xScale
	if yScale > xScale {
		scale = yScale
	}
	newWidth := int(float64(bounds.Dx()) / scale)
	newHeight := int(float64(bounds.Dy()) / scale)
	smallImg := image.NewRGBA(image.Rect(0, 0, newWidth, newHeight))
	for y := 0; y < newHeight; y++ {
		for x := 0; x < newWidth; x++ {
			color := img.At(int(float64(x)*scale), int(float64(y)*scale))
			smallImg.Set(x, y, color)
		}
	}
	return smallImg
}
