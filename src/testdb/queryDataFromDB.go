package main // 声明 main 包
// go get -u github.com/go-sql-driver/mysql
// thanks: https://blog.csdn.net/memory_qianxiao/article/details/109632778
import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql" // 导入包但不使用,相当于只调用init()初始化
)

/*
// mysql 5.7 以上修改root密码
// 首先使用旧密码进入mysql,接着执行如下命令
use mysql;
flush privileges;
alter user 'root'@'localhost' identified by '123456';
flush privileges;
exit;
*/

type user struct {
	id   int
	name string
	info string
}

var db *sql.DB //连接池对象
func initDB() (err error) {
	//数据库
	//用户名:密码啊@tcp(ip:端口)/数据库的名字
	dsn := "root:123456@tcp(127.0.0.1:3306)/testbase"
	//连接数据集
	db, err = sql.Open("mysql", dsn) //open不会检验用户名和密码
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
func query(id int) {
	//1.查询单挑记录的sql语句  ?是参数
	sqlStr := "select id,name,info from person where id=?;"
	//2.执行
	rowObj := db.QueryRow(sqlStr, id) //从连接池里取一个连接出来去数据库查询单挑记录
	//3.拿到结果
	var u1 user
	rowObj.Scan(&u1.id, &u1.name, &u1.info)
	//打印结果
	fmt.Printf("u1:%#v\n", u1)
}

func queryMore(n int) {
	// 1.sql语句
	sqlStr := "select id,name,info from person where id >?;"
	// 2.执行
	rows, err := db.Query(sqlStr, n)
	if err != nil {
		fmt.Printf("%s query failed,err:%v\n", sqlStr, err)
		return
	}
	// 3.一定要关闭rows
	defer rows.Close()
	// rowsTotal := len(*rows)
	// fmt.Println("rowsTotal: ", rowsTotal)
	// 4.循环取值
	for rows.Next() {
		var u1 user
		rows.Scan(&u1.id, &u1.name, &u1.info)
		fmt.Printf("u1:%#v\n", u1)
	}
}

// Go连接Mysql示例
func main() {
	fmt.Println("init !!!")
	err := initDB()
	if err != nil {
		fmt.Printf("init DB failed,err%v\n", err)
	}
	// 查询单行
	fmt.Println("query single row data.")
	query(3)
	// 查询多行
	fmt.Println("query multiple rows data.")
	queryMore(0)
	fmt.Println("finish.")
}
