package sockHandle

// thanks: https://zhuanlan.zhihu.com/p/489023088
import (
	"errors"
	"fmt"
	"sync"

	"github.com/gorilla/websocket"
)

// wsConn TODO:封装的基本结构体
type wsConn struct {
	inChan    chan []byte
	outChan   chan []byte
	closeChan chan []byte
	isClose   bool // 通道closeChan是否已经关闭
	mutex     sync.Mutex
	conn      *websocket.Conn
}

// InitWebSocket TODO:初始化Websocket
func InitWebSocket(conn *websocket.Conn) (ws *wsConn, err error) {
	ws = &wsConn{
		inChan:    make(chan []byte, 1024),
		outChan:   make(chan []byte, 1024),
		closeChan: make(chan []byte, 1024),
		conn:      conn,
	}
	// 完善必要协程：读取客户端数据协程/发送数据协程
	go ws.readMsgLoop()
	go ws.writeMsgLoop()
	return
}

// InChanRead TODO:读取inChan的数据
func (conn *wsConn) InChanRead() (data []byte, err error) {
	select {
	case data = <-conn.inChan:
	case <-conn.closeChan:
		err = errors.New("connection is closed")
	}
	return
}

// InChanWrite TODO:inChan写入数据
func (conn *wsConn) InChanWrite(data []byte) (err error) {
	select {
	case conn.inChan <- data:
	case <-conn.closeChan:
		err = errors.New("connection is closed")
	}
	return
}

// OutChanRead TODO:读取inChan的数据
func (conn *wsConn) OutChanRead() (data []byte, err error) {
	select {
	case data = <-conn.outChan:
	case <-conn.closeChan:
		err = errors.New("connection is closed")
	}
	return
}

// OutChanWrite TODO:inChan写入数据
func (conn *wsConn) OutChanWrite(data []byte) (err error) {
	select {
	case conn.outChan <- data:
	case <-conn.closeChan:
		err = errors.New("connection is closed")
	}
	return
}

// CloseConn TODO:关闭WebSocket连接
func (conn *wsConn) CloseConn() {
	// 关闭closeChan以控制inChan/outChan策略,仅此一次
	conn.mutex.Lock()
	if !conn.isClose {
		fmt.Println("sockBase CloseConn A !!!")
		close(conn.closeChan)
		conn.isClose = true
	}
	conn.mutex.Unlock()
	//关闭WebSocket的连接,conn.Close()是并发安全可以多次关闭
	fmt.Println("sockBase CloseConn B !!!")
	_ = conn.conn.Close()
}

// readMsgLoop TODO:读取客户端发送的数据写入到inChan
func (conn *wsConn) readMsgLoop() {
	for {
		// 确定数据结构
		var (
			data []byte
			err  error
		)
		// 接受数据
		if _, data, err = conn.conn.ReadMessage(); err != nil {
			goto ERR
		}
		// 写入数据
		if err = conn.InChanWrite(data); err != nil {
			goto ERR
		}
	}
ERR:
	fmt.Println("sockBase readMsgLoop err !!!")
	conn.CloseConn()
}

// writeMsgLoop TODO:读取outChan的数据响应给客户端
func (conn *wsConn) writeMsgLoop() {
	for {
		var (
			data []byte
			err  error
		)
		// 读取数据
		if data, err = conn.OutChanRead(); err != nil {
			goto ERR
		}
		// 发送数据
		if err = conn.conn.WriteMessage(1, data); err != nil {
			goto ERR
		}
	}
ERR:
	fmt.Println("sockBase writeMsgLoop err !!!")
	conn.CloseConn()
}
