package database

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql" // 导入包但不使用,相当于只调用init(
	_ "github.com/go-sql-driver/mysql" // 导入包但不使用,相当于只调用init(
	_ "github.com/go-sql-driver/mysql" // 导入包但不使用,相当于只调用init(
	_ "github.com/go-sql-driver/mysql" // 导入包但不使用,相当于只调用init()初始化
)

// go mod init voxwebsvr.com/database

/*
create table pagestatus(

	id int(4) auto_increment not null primary key,
	name char(50) not null,
	count int(8) default '0',
	src varchar(50) default 'non-module',
	info varchar(80) default 'This is a page.'
	);

insert into pagestatus values(

	1,'website',0,'non-src', 'web site all'
	);

UPDATE pagestatus SET name = 'tt' , cont = '100'  WHERE id = 10;

create table pagemessage(
	id int(4) auto_increment not null primary key,
	name char(50) default 'message-page-name',
	starCount int(8) default '0',
	src varchar(50) default 'non-src',
	message varchar(600) default 'please write your thinks here,thanks.',
	dstUser varchar(30) default 'users',
	creationtime datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'creation time'
	);
insert into pagemessage
	(name, message)
	values
	(
	'user002','I need an inspection tool'
	);


时间操作:

1. 添加 creationtime 设置默认时间 CURRENT_TIMESTAMP

ALTER TABLE `pagemessage`
ADD COLUMN  `creationtime` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'creation time' ;

2. 修改 creationtime 设置默认时间 CURRENT_TIMESTAMP

ALTER TABLE `pagemessage`
MODIFY COLUMN  `creationtime` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间' ;

3. 添加 updatetime 设置 默认时间 CURRENT_TIMESTAMP 设置更新时间为 ON UPDATE CURRENT_TIMESTAMP

ALTER TABLE `pagemessage`
ADD COLUMN `updatetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间' ;

4. 修改 updatetime 设置 默认时间 CURRENT_TIMESTAMP 设置更新时间为 ON UPDATE CURRENT_TIMESTAMP

ALTER TABLE `pagemessage`
MODIFY COLUMN `updatetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAM;
*/

type STDBChannelData struct {
	stName string
	stType int
	flag   int
}

var stDBChannel chan STDBChannelData

func AppendSTDBData(name string, flags ...int) {
	var st STDBChannelData
	st.stName = name
	st.stType = 1
	st.flag = 0
	fn := len(flags)
	if fn > 0 {
		st.stType = flags[0]
		if fn > 1 {
			st.flag = flags[1]
		}
	}
	stDBChannel <- st
}
func updateSTDataToDB(in <-chan STDBChannelData) {
	var total = 0
	var ls [128]STDBChannelData
	// var nsList [128]string
	nsList := make([]string, 128)
	for data := range in {
		len := len(in)
		// fmt.Printf("updateSTDataToDB() len=%v cap=%v\n", len(in), cap(in))
		// fmt.Println("updateSTDataToDB() data.stName: ", data.stName, ", stType: ", data.stType)
		if data.flag < 1 {
			ls[total] = data
			total++
			// 先直接更新内存数据而不是数据库数据
			IncreaseLogicPageViewCountByName(data.stName, data.stType)
		}
		// if len == 0 || total > 31 {
		if data.flag > 0 || total > 15 {
			if total > 0 {
				// 整体一起修改数据库, 做合并操作，提升性能
				// if total > 1 {
				for i := 0; i < total; i++ {
					nsList[i] = ls[i].stName
				}
				IncreaseLogicPageViewCountToDBByNames(nsList, total)
			}
			total = len
			total = 0
		}
	}
}
func startupSTDataToDBTicker(out chan<- STDBChannelData) {

	for range time.Tick(15 * time.Second) {
		// fmt.Println("tick does...")
		var st STDBChannelData
		st.stName = "ticker_sender_data"
		st.stType = 0
		st.flag = 1
		out <- st
	}
}
func initChannel() {

	stDBChannel = make(chan STDBChannelData, 128)
	go updateSTDataToDB(stDBChannel)
	go startupSTDataToDBTicker(stDBChannel)
}

var sys_web_pst_db *sql.DB = nil

var initFlag = true

func Init() {

	if initFlag {
		initFlag = false

		fmt.Println("init database sys ...")
		dbErr := initWebPageStatusDB()
		if dbErr != nil {
			fmt.Printf("database sys init failed,err%v\n", dbErr)
		}
		fmt.Println("init database sys success !!!")

		initPageModule(sys_web_pst_db)

		initChannel()
	}
}
func initWebPageStatusDB() (err error) {

	dsn := "root:123456@tcp(127.0.0.1:3306)/webpagestatus?charset=utf8&multiStatements=true" // 可执行多条语句
	// dsn := "root:123456@tcp(127.0.0.1:3306)/webpagestatus"

	sys_web_pst_db, err = sql.Open("mysql", dsn) // open不会检验用户名和密码
	if err != nil {
		return
	}
	err = sys_web_pst_db.Ping() //尝试连接数据库
	if err != nil {
		return
	}
	fmt.Println("连接 sys_web_pst_db 数据库成功~")
	// 设置数据库连接参数
	sys_web_pst_db.SetConnMaxLifetime(time.Minute * 3)
	sys_web_pst_db.SetMaxOpenConns(10)
	sys_web_pst_db.SetMaxIdleConns(10)
	return
}

func IncreasePageViewCountByName(ns string, flags ...int) int {
	node, hasKey := pageSTNodeMap[ns]
	if hasKey {
		node.count++
		// fmt.Println("IncreasePageViewCountByName(), A pageViewsTotal: ", pageViewsTotal)
		if len(flags) < 1 {
			pageViewsTotal++
		} else if flags[0] > 0 {
			pageViewsTotal++
		}
		// fmt.Println("IncreasePageViewCountByName(), B pageViewsTotal: ", pageViewsTotal)
		// 通过比较这oldCount和count的值来判断是否有更新
		node.oldCount = node.count
		UpdateSitePageReqCountByID(node.count, node.id)
		return node.count
	}
	return 0
}

func IncreaseLogicPageViewCountByName(ns string, flag int) {
	node, hasKey := pageSTNodeMap[ns]
	if hasKey {
		node.count++
		if flag > 0 {
			pageViewsTotal++
		}
	}
}

func IncreaseLogicPageViewCountToDBByNames(nsList []string, total int) {

	sqlTot := 0
	sqlStr := ""
	for i := 0; i < total; i++ {
		ns := nsList[i]
		node, hasKey := pageSTNodeMap[ns]
		if hasKey {
			if node.oldCount != node.count {
				node.oldCount = node.count
				// fmt.Println("IncreaseLogicPageViewCountToDBByNames(), node.name: ", node.name)
				sqlStr += BuildUpdateSitePageReqCountByID(node.count, node.id)
				sqlTot++
			}
		}
	}
	if sqlTot > 0 {
		// fmt.Println("IncreaseLogicPageViewCountToDBByNames(), sqlStr: ", sqlStr)
		UpdateSitePageReqCountBySQLStr(sqlStr)
	}
}

func QuerySitePageReqCountByID(id int) {

	sqlStr := "select id, name, count from pagestatus where id=?;"
	rowObj := sys_web_pst_db.QueryRow(sqlStr, id)

	var st PageStatusNode
	rowObj.Scan(&st.id, &st.name, &st.count)
}
func BuildUpdateSitePageReqCountByID(count int, id int) string {
	sqlStr := `update pagestatus set count=` + strconv.Itoa(count) + ` where id=` + strconv.Itoa(id) + `;`
	return sqlStr
}
func UpdateSitePageReqCountByID(count int, id int) {
	sqlStr := BuildUpdateSitePageReqCountByID(count, id)
	_, err := sys_web_pst_db.Exec(sqlStr)
	if err != nil {
		fmt.Printf("update failed ,err:%v\n", err)
		return
	}
}
func UpdateSitePageReqCountBySQLStr(sqlStr string) {
	// sqlStr := BuildUpdateSitePageReqCountByID(count, id)
	_, err := sys_web_pst_db.Exec(sqlStr)
	if err != nil {
		fmt.Printf("update failed ,err:%v\n", err)
		return
	}
	// else {
	// 	fmt.Println("UpdateSitePageReqCountBySQLStr(), success !!!")
	// }
	// n, _ := ret.RowsAffected()
	// n += 1
	// fmt.Printf("UpdateSitePageReqCountByID(), 更新了 %d 行数据\n", n)
}
func UpdateSitePageReqCountByID2(count int, id int) {
	sqlStr := `update pagestatus set count=? where id=?;`
	_, err := sys_web_pst_db.Exec(sqlStr, count, id)
	if err != nil {
		fmt.Printf("update failed ,err:%v\n", err)
		return
	}
}
