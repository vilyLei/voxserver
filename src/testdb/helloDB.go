package main // 声明 main 包
// go get -u github.com/go-sql-driver/mysql
// thanks: https://blog.csdn.net/memory_qianxiao/article/details/109632778
import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql" // 导入包但不使用,相当于只调用init()初始化
)

func main() {
	// 声明 main 主函数
	fmt.Println("Hello World testDB !!!") // 打印 Hello World!
	// 数据库
	// 用户名:密码啊@tcp(ip:端口)/数据库的名字
	// 用户: root，密码: 123456   ，连接Mysql 的IP地址: 127.0.0.1 ，端口: 3306, 连接数据库的名字: test
	dsn := "root:123456@tcp(127.0.0.1:3306)/testbase"
	//连接数据集
	db, err := sql.Open("mysql", dsn) // open不会检验用户名和密码
	if err != nil {
		fmt.Printf("dsn:%s invalid,err:%v\n", dsn, err)
		return
	}
	err = db.Ping() //尝试连接数据库
	if err != nil {
		fmt.Printf("open %s faild,err:%v\n", dsn, err)
		return
	}
	fmt.Println("连接数据库成功~")
}
