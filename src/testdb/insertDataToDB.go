package main // 声明 main 包
// go get -u github.com/go-sql-driver/mysql
// thanks: https://blog.csdn.net/memory_qianxiao/article/details/109632778
import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql" // 导入包但不使用,相当于只调用init()初始化
)

var db *sql.DB //连接池对象
func initDB() (err error) {
	//数据库
	//用户名:密码啊@tcp(ip:端口)/数据库的名字
	dsn := "root:123456@tcp(127.0.0.1:3306)/testbase"
	//连接数据集
	db, err = sql.Open("mysql", dsn) // open不会检验用户名和密码
	if err != nil {
		return
	}
	err = db.Ping() //尝试连接数据库
	if err != nil {
		return
	}
	fmt.Println("连接数据库成功~")
	//设置数据库连接池的最大连接数
	db.SetMaxIdleConns(10)
	return
}

func insert() {
	sqlStr := `insert into person(id, name, info) values(0,"Lucy","a sunshine woman.")` // sql语句
	ret, err := db.Exec(sqlStr)                                                         // 执行sql语句
	if err != nil {
		fmt.Printf("insert failed,err:%v\n", err)
		return
	}
	//如果是插入数据的操作，能够拿到插入数据的id
	id, err := ret.LastInsertId()
	if err != nil {
		fmt.Printf("get id failed,err:%v\n", err)
		return
	}
	fmt.Println("id", id)
}

// Go连接Mysql示例
func main() {
	fmt.Println("init !!!")
	err := initDB()
	if err != nil {
		fmt.Printf("init DB failed,err%v\n", err)
	}
	//插入数据
	insert()
}
