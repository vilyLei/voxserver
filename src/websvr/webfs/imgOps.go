package webfs

import (
	"image"
	"image/jpeg"
	"image/png"
	"math"
	"os"
	"strings"
)

func ResizeToImgsAndSave(imgDir string, imgName string, init_w int, init_h int) int {
	total := 1
	if init_w <= 128 && init_h <= 128 {
		ResizeImgAndSave(imgDir, imgName, init_w, init_h, "mini_0")
	} else {

		if init_w == init_h {
			if init_w > 512 {
				total += 1
				ResizeImgAndSave(imgDir, imgName, 512, 512, "mini_1")
			}
			ResizeImgAndSave(imgDir, imgName, 128, 128, "mini_0")
		} else {

			width := float64(init_w)
			height := float64(init_h)
			factor := 1.0
			size := init_w

			miniW := 1.0
			miniH := 1.0
			mini_1W := 1.0
			mini_1H := 1.0

			if init_w > init_h {

				size = init_w
				factor = height / width

				miniW = 128.0
				miniH = math.Floor(factor * miniW)
				mini_1W = 512.0
				mini_1H = math.Floor(factor * mini_1W)

			} else if init_w < init_h {

				size = init_h
				factor = width / height

				miniH = 128.0
				miniW = math.Floor(factor * miniH)
				mini_1H = 512.0
				mini_1W = math.Floor(factor * mini_1H)
			}
			if size > 512 {
				total += 1
				ResizeImgAndSave(imgDir, imgName, int(mini_1W), int(mini_1H), "mini_1")
			}
			ResizeImgAndSave(imgDir, imgName, int(miniH), int(miniW), "mini_0")
		}
	}
	return total
}
func ResizeImgAndSave(imgDir string, imgName string, pw int, ph int, nameSuffix string) {

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
		out, err := os.Create(imgDir + parts[0] + "_" + nameSuffix + ".png")
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
		out, err := os.Create(imgDir + parts[0] + "_" + nameSuffix + ".jpg")
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
func resize(img image.Image, width int, height int) image.Image {
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
