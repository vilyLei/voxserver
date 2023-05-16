package database

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql" // 导入包但不使用,相当于只调用init()初始化
)

// go mod init voxwebsvr.com/database

/*
create table pagestatus(

	id int(4) auto_increment not null primary key,
	name char(30) not null,
	count int(8) not null,
	src varchar(30) default 'non-module',
	info varchar(50) default 'This is a page.'
	);

insert into pagestatus values(

	1,'website',0,'non-src', 'web site all'
	);
*/
type PageStatus struct {
	id    int
	name  string
	count int
	src   string
	info  string
}

var web_pst_db *sql.DB = nil //连接池对象
var web_site_req_all_req_count = 0

func InitWebPageStatusDB() (err error) {
	//数据库
	//用户名:密码啊@tcp(ip:端口)/数据库的名字
	dsn := "root:123456@tcp(127.0.0.1:3306)/webpagestatus"
	//连接数据集
	web_pst_db, err = sql.Open("mysql", dsn) //open不会检验用户名和密码
	if err != nil {
		return
	}
	err = web_pst_db.Ping() //尝试连接数据库
	if err != nil {
		return
	}
	fmt.Println("连接 web_pst_db 数据库成功~")
	// 设置数据库连接参数
	web_pst_db.SetConnMaxLifetime(time.Minute * 3)
	web_pst_db.SetMaxOpenConns(10)
	web_pst_db.SetMaxIdleConns(10)
	return
}

func QuerySitePageReqCountByID(id int) {
	//1.查询单挑记录的sql语句  ?是参数
	sqlStr := "select id, name, count from pagestatus where id=?;"
	//2.执行
	rowObj := web_pst_db.QueryRow(sqlStr, id) //从连接池里取一个连接出来去数据库查询单挑记录
	//3.拿到结果
	var st PageStatus
	rowObj.Scan(&st.id, &st.name, &st.count)
	web_site_req_all_req_count = st.count
	// 打印结果
	fmt.Printf("QuerySitePageReqCountByID(), st: %#v\n", st)
	fmt.Printf("QuerySitePageReqCountByID(), web_site_req_all_req_count: %#v\n", web_site_req_all_req_count)
}

/*
	func QuerySitePageReqCountByID(id int) {
		// 1.sql语句
		sqlStr := "select id,name,info from pagestatus where id =?;"
		// 2.执行
		rows, err := web_pst_db.Query(sqlStr, id)
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
			var st PageStatus
			rows.Scan(&st.id, &st.name, &st.count, &st.src, &st.info)
			fmt.Printf("st:%#v\n", st)
		}
	}

//
*/
func UpdateSitePageReqCountByID(count int, id int) {
	sqlStr := `update pagestatus set count=? where id=?`
	ret, err := web_pst_db.Exec(sqlStr, count, id)
	if err != nil {
		fmt.Printf("update failed ,err:%v\n", err)
		return
	}
	n, _ := ret.RowsAffected()
	fmt.Printf("UpdateSitePageReqCountByID(), 更新了 %d 行数据\n", n)
}
