package main // 声明 main 包
// 安装MySQL驱动
// go get -u gorm.io/driver/mysql
// 安装gorm包
// go get -u gorm.io/gorm
// thanks:
// https://www.tizi365.com/archives/6.html
// https://learnku.com/docs/gorm/v2/connecting_to_the_database/9731
// /*
// import (
// 	"fmt"
// 	"gorm.io/driver/mysql"
// 	"gorm.io/gorm"
// )
// */
// import (
// 	"database/sql"
// 	"fmt"
// )

// func main() {
// 	// 声明 main 主函数
// 	fmt.Println("Hello World testDB !!!") // 打印 Hello World!
// 	// 数据库
// 	// 用户名:密码啊@tcp(ip:端口)/数据库的名字
// 	// 用户: root，密码: 123456   ，连接Mysql 的IP地址: 127.0.0.1 ，端口: 3306, 连接数据库的名字: test
// 	dsn := "root:123456@tcp(127.0.0.1:3306)/testbase"
// 	//连接数据集
// 	db, err := sql.Open("mysql", dsn) // open不会检验用户名和密码
// 	if err != nil {
// 		fmt.Printf("dsn:%s invalid,err:%v\n", dsn, err)
// 		return
// 	}
// 	err = db.Ping() //尝试连接数据库
// 	if err != nil {
// 		fmt.Printf("open %s faild,err:%v\n", dsn, err)
// 		return
// 	}
// 	fmt.Println("连接数据库成功~")
// }

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Person struct {
	id   uint `gorm:"primaryKey;default:auto_random()"`
	name string
	// id   uint
	info string
}

func (Person) TableName() string {

	return "person"
}

func main() {
	db, err := gorm.Open(mysql.Open("root:123456@tcp(127.0.0.1:3306)/testbase"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	} else {
		fmt.Println("connect database success")
	}
	// defer db.Close()
	// db.SingularTable(true)
	db.AutoMigrate(&Person{})

	insertPerson := &Person{id: 7, name: "100", info: "D42"}

	db.Create(&insertPerson)
	fmt.Printf("A insert id: %d, Info: %s, Name: %s\n",
		insertPerson.id, insertPerson.info, insertPerson.name)

	readPerson := &Person{}
	db.First(&readPerson, "name = ?", "Lucy") // find product with name choco
	// db.Find(&readPerson, "id = ?", "0") // find product with name choco

	fmt.Printf("B read id: %d, Name: %s, Info: %s\n",
		readPerson.id, readPerson.name, readPerson.info)
}
