package main

import (
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

/*
四个处理类型，分别是：

sqlx.DB – 类似原生的 sql.DB
sqlx.Tx – 类似原生的 sql.Tx
sqlx.Stmt – 类似原生的 sql.Stmt, 准备 SQL 语句操作
sqlx.NamedStmt – 对特定参数命名并绑定生成 SQL 语句操作

个游标类型，分别是：

sqlx.Rows – 类似原生的 sql.Rows, 从 Queryx 返回
sqlx.Row  – 类似原生的 sql.Row, 从 QueryRowx 返回

thanks: https://segmentfault.com/a/1190000023113675

create table testusers(

	id int(4) auto_increment not null primary key,
	name char(50) not null,
	age int(8) not null
	);

insert into testusers values(

	1,'vily',30
	);

insert into testusers values(

	2,'lily313',35
	);

// 创建支持 MySQL 事务 的table
create table testusers_transaction(

	id int(4) auto_increment not null primary key,
	name char(50) not null,
	age int(8) not null
	) engine=innodb;

insert into testusers_transaction values(

	1,'lily313',35
	);

insert into testusers_transaction values(

	2,'vily',41
	);
*/
var initFlag = true

type PageStatusNode struct {
	Id    int    `db:"id"`
	Name  string `db:"name"`
	Count int    `db:"count"`
}

//	type PageStatusNode struct {
//		id       int
//		name     string
//		count    int
//		oldCount int
//		src      string
//		info     string
//	}
type User struct {
	Id   int    `db:"id"`
	Name string `db:"name"`
	Age  int    `db:"age"`
}

// var sqlDB *sql.DB = nil // 连接池对象
var sqlDB *sqlx.DB = nil // 连接池对象
func initDB() (err error) {

	dsn := "root:123456@tcp(127.0.0.1:3306)/webpagestatus?charset=utf8&multiStatements=true" // 可执行多条语句
	// dsn := "root:123456@tcp(127.0.0.1:3306)/webpagestatus"

	// sqlDB, err = sql.Open("mysql", dsn) // open不会检验用户名和密码
	sqlDB, err = sqlx.Open("mysql", dsn) // open不会检验用户名和密码
	if err != nil {
		return
	}
	err = sqlDB.Ping() //尝试连接数据库
	if err != nil {
		return
	}
	fmt.Println("连接 sqlDB 数据库成功~")
	// 设置数据库连接参数
	sqlDB.SetConnMaxLifetime(time.Minute * 3)
	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetMaxIdleConns(10)
	return
}
func queryRowA() {
	sqlStr := "SELECT id, name, count FROM pagestatus WHERE id = ?;"

	var node PageStatusNode
	if err := sqlDB.Get(&node, sqlStr, 1); err != nil {
		fmt.Printf("get data failed, err: %v\n", err)
		return
	}
	fmt.Printf("queryRow(), id: %d, name: %s, count: %d\n", node.Id, node.Name, node.Count)
}

// 查询一行数据
func queryRow() {
	sqlStr := "SELECT id, name FROM testusers WHERE id = ?;"

	var u User
	if err := sqlDB.Get(&u, sqlStr, 1); err != nil {
		fmt.Printf("get data failed, err:%v\n", err)
		return
	}
	fmt.Printf("queryRow(), id:%d, name:%s\n", u.Id, u.Name)
}
func queryRowAll() {
	sqlStr := "SELECT id, name, age FROM testusers WHERE id = ?;"

	var u User
	if err := sqlDB.Get(&u, sqlStr, 1); err != nil {
		fmt.Printf("get data failed, err:%v\n", err)
		return
	}
	fmt.Printf("queryRow(), id:%d, name:%s, age:%d\n", u.Id, u.Name, u.Age)
}

// 查询多行数据
func queryMultiRow() {
	sqlStr := "SELECT id, name, age FROM testusers WHERE id > ?"
	var users []User
	if err := sqlDB.Select(&users, sqlStr, 0); err != nil {
		fmt.Printf("get data failed, err:%v\n", err)
		return
	}
	for i := 0; i < len(users); i++ {
		fmt.Printf("queryMultiRow(), id:%d, name:%s, age:%d\n", users[i].Id, users[i].Name, users[i].Age)
	}
}

// 插入数据
func insertRow(name string, age int) {
	sqlStr := "INSERT INTO testusers(name, age) VALUES(?, ?)"
	result, err := sqlDB.Exec(sqlStr, name, age)
	if err != nil {
		fmt.Printf("exec failed, err:%v\n", err)
		return
	}
	insertID, err := result.LastInsertId()
	if err != nil {
		fmt.Printf("get insert id failed, err:%v\n", err)
		return
	}
	fmt.Printf("insertRow(), insert data success, id:%d\n", insertID)
}

// 更新数据
func updateRow(age int, id int) {
	sqlStr := "UPDATE testusers SET age = ? WHERE id = ?"
	result, err := sqlDB.Exec(sqlStr, age, id)
	if err != nil {
		fmt.Printf("exec failed, err:%v\n", err)
		return
	}
	affectedRows, err := result.RowsAffected()
	if err != nil {
		fmt.Printf("get affected failed, err:%v\n", err)
		return
	}
	fmt.Printf("updateRow(), update data success, affected rows:%d\n", affectedRows)
}

// 删除一行
func deleteRow(id int) {
	sqlStr := "DELETE FROM testusers WHERE id = ?"
	result, err := sqlDB.Exec(sqlStr, id)
	if err != nil {
		fmt.Printf("exec failed, err:%v\n", err)
		return
	}
	affectedRows, err := result.RowsAffected()
	if err != nil {
		fmt.Printf("get affected failed, err:%v\n", err)
		return
	}
	fmt.Printf("deleteRow(), delete data success, affected rows:%d\n", affectedRows)
}

// 绑定查询
func selectNamedQuery() {
	sqlStr := "SELECT id, name, age FROM testusers WHERE age = :age"
	rows, err := sqlDB.NamedQuery(sqlStr, map[string]interface{}{
		"age": 22,
	})
	if err != nil {
		fmt.Printf("named query failed failed, err:%v\n", err)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var u User
		if err := rows.StructScan(&u); err != nil {
			fmt.Printf("struct sacn failed, err:%v\n", err)
			continue
		}
		fmt.Printf("selectNamedQuery(), %#v\n", u)
	}
}

// 使用 named 方法插入数据
func insertNamedExec() {
	sqlStr := "INSERT INTO testusers(name, age) VALUES(:name, :age)"
	result, err := sqlDB.NamedExec(sqlStr, map[string]interface{}{
		"name": "thrfoo",
		"age":  27,
	})
	if err != nil {
		fmt.Printf("named exec failed, err:%v\n", err)
		return
	}
	insertId, err := result.LastInsertId()
	if err != nil {
		fmt.Printf("get last insert id failed, err:%v\n", err)
		return
	}
	fmt.Printf("insertNamedExec(), insert data success, id:%d\n", insertId)
}

// 事务操作
func updateTransaction() (err error) {
	tx, err := sqlDB.Begin()
	if err != nil {
		fmt.Printf("transaction begin failed, err:%v\n", err)
		return err
	}

	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback()
			panic(p)
		} else if err != nil {
			fmt.Printf("transaction rollback")
			_ = tx.Rollback()
		} else {
			err = tx.Commit()
			fmt.Printf("transaction commit")
			return
		}
	}()

	sqlStr1 := "UPDATE testusers_transaction SET age = ? WHERE id = ? "
	reuslt1, err := tx.Exec(sqlStr1, 18, 1)
	if err != nil {
		fmt.Printf("sql exec failed, err:%v\n", err)
		return err
	}
	rows1, err := reuslt1.RowsAffected()
	if err != nil {
		fmt.Printf("affected rows is 0")
		return
	}
	sqlStr2 := "UPDATE testusers_transaction SET age = ? WHERE id = ? "
	reuslt2, err := tx.Exec(sqlStr2, 19, 5)
	if err != nil {
		fmt.Printf("sql exec failed, err:%v\n", err)
		return err
	}
	rows2, err := reuslt2.RowsAffected()
	if err != nil {
		fmt.Printf("affected rows is 0\n")
		return
	}

	if rows1 > 0 && rows2 > 0 {
		fmt.Printf("updateTransaction(), update data success\n")
	}
	return
}
func Init() {

	if initFlag {
		initFlag = false

		fmt.Println("init database sys ...")
		dbErr := initDB()
		if dbErr != nil {
			fmt.Printf("database sys init failed,err%v\n", dbErr)
			return
		}
		fmt.Println("init database sys success !!!")

		queryRowA()
		queryRow()
		queryMultiRow()
		// insertRow("Fifi", 22)
		// insertRow("ticoo", 32)
		// deleteRow(2)
		// updateRow(25, 5)
		selectNamedQuery()
		insertNamedExec()

		transactionErr := updateTransaction()
		if transactionErr != nil {
			fmt.Printf("updateTransaction failed,err%v\n", transactionErr)
			return
		}
		fmt.Println("updateTransaction success !!!")
	}
}
func main() {
	fmt.Println("sys init ...")
	Init()
	fmt.Println("sys end ...")
}
