package main

import (
	"fmt"
	"time"
)

// 模拟订单对象
type OrderInfo struct {
	id int
}

// 生产订单--生产者
func producerOrder(out chan<- OrderInfo) {
	// 业务生成订单
	for i := 0; i < 10; i++ {
		order := OrderInfo{id: i + 1}
		fmt.Println("生成订单，订单ID为：", order.id)
		out <- order // 写入channel
	}
	// 如果不关闭，消费者就会一直阻塞，等待读
	close(out) // 订单生成完毕，关闭channel
}

// 处理订单--消费者
func consumerOrder(in <-chan OrderInfo) {
	// 从channel读取订单，并处理
	for order := range in {
		fmt.Println("读取订单，订单ID为：", order.id)
	}
}

func main() {
	ch := make(chan OrderInfo, 5)
	go producerOrder(ch)
	go consumerOrder(ch)
	time.Sleep(time.Second * 2)
}
