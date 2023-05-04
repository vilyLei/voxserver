package main // 声明 main 包
// go get -u github.com/go-sql-driver/mysql
// thanks: https://blog.csdn.net/memory_qianxiao/article/details/109632778
import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql" // 导入包但不使用,相当于只调用init()初始化
)

/*
// ver 5.7以上修改root密码
mysql -uroot
use mysql;
flush privileges;
alter user 'root'@'localhost' identified by '你的密码';
flush privileges;
exit;
*/
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
func deleteRow(id int) {
	sqlStr := `delete from person where id=?`
	ret, err := db.Exec(sqlStr, id)
	if err != nil {
		fmt.Printf("delete faild,err:%v\n", err)
		return
	}
	n, _ := ret.RowsAffected()
	fmt.Printf("删除了%d行数据\n", n)

}

// Go连接Mysql示例
func main() {
	fmt.Println("init !!!")
	err := initDB()
	if err != nil {
		fmt.Printf("init DB failed,err%v\n", err)
	}
	//删除数据
	deleteRow(1)
}
