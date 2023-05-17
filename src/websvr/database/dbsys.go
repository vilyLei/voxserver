package database

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql" // 导入包但不使用,相当于只调用init()初始化
)

// go mod init voxwebsvr.com/database

/*
create table pagestatus(

	id int(4) auto_increment not null primary key,
	name char(50) not null,
	count int(8) not null,
	src varchar(50) default 'non-module',
	info varchar(80) default 'This is a page.'
	);

insert into pagestatus values(

	1,'website',0,'non-src', 'web site all'
	);

insert into pagestatus values(

	2,'website-engine',0,'non-src', 'web engine page'
	);

insert into pagestatus values(

	3,'website-tool',0,'non-src', 'web tool page'
	);

insert into pagestatus values(

	4,'website-game',0,'non-src', 'web game page'
	);

insert into pagestatus values(

	5,'website-course',0,'non-src', 'web course page'
	);

insert into pagestatus values(

	6,'website-renderCase',0,'non-src', 'web renderCase page'
	);
*/
type PageStatusNode struct {
	id    int
	name  string
	count int
	src   string
	info  string
}
type InsInfoNode struct {
	Name string `json:"name"`
	Ver  string `json:"ver"`
}
type InsInfoJson struct {
	Demos []InsInfoNode `json:"demos"`
}

var web_pst_db *sql.DB = nil // 连接池对象
var pageReqCounts [2048]int
var homePageSTID = 1
var pageSTNodeMap map[string]*PageStatusNode
var pageSTNodesTotal = 0
var pageViewsTotal = 0

func Init() {

	pageSTNodeMap = make(map[string]*PageStatusNode)

	fmt.Println("init database sys ...")
	dbErr := InitWebPageStatusDB()
	if dbErr != nil {
		fmt.Printf("database sys init failed,err%v\n", dbErr)
	}
	fmt.Println("init database sys success !!!")
	QuerySitePageReqCountByID(1)
	// database.UpdateSitePageReqCountByID(1, 1)
	initPageStInfoFromDB()
	UpdatePageInsStatusInfo()
}
func insertPageStRecord(id int, name string) {
	//5,'website-course',0,'non-src', 'web course page'
	idStr := strconv.Itoa(id)
	// sqlStr := `insert into person(id, name, count, src, info) values(0,"Lucy","a sunshine woman.")`
	sqlStr := `insert into pagestatus(id, name, count, src, info) values(`
	sqlStr += idStr + `,"` + name + `", 0, "non-src", "demo ins page")`
	// fmt.Println("insertPageStRecord sqlStr: ", sqlStr)
	// ret, err := web_pst_db.Exec(sqlStr)
	_, err := web_pst_db.Exec(sqlStr)
	if err != nil {
		fmt.Printf("insertPageStRecord failed,err:%v\n", err)
		return
	} else {
		fmt.Println("insertPageStRecord success !!!, name: ", name)
	}
	// // 如果是插入数据的操作，能够拿到插入数据的id
	// pid, err := ret.LastInsertId()
	// if err != nil {
	// 	fmt.Printf("get id failed,err:%v\n", err)
	// 	return
	// }
	// fmt.Println("pid", pid)
}
func InitWebPageStatusDB() (err error) {

	dsn := "root:123456@tcp(127.0.0.1:3306)/webpagestatus"

	web_pst_db, err = sql.Open("mysql", dsn) // open不会检验用户名和密码
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

func initPageStInfoFromDB() {

	sqlStr := "select * from pagestatus;"
	rows, err := web_pst_db.Query(sqlStr)
	if err != nil {
		fmt.Printf("%s query failed,err:%v\n", sqlStr, err)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var node PageStatusNode
		rows.Scan(&node.id, &node.name, &node.count, &node.src, &node.info)
		pageSTNodeMap[node.name] = &node
		pageSTNodesTotal++
		fmt.Printf("initPageStInfoFromDB(), node:%#v\n", node)
	}
}
func GetPageViewsTotal() int {
	return pageViewsTotal
}
func UpdatePageInsStatusInfo() {

	fmt.Println("UpdatePageInsStatusInfo() init ...")

	pageViewsTotal = 0
	total := 0
	var pageNSList = [...]string{"website", "website-engine", "website-tool", "website-course", "website-game", "website-renderCase"}
	pagesTotal := len(pageNSList)
	for i := 0; i < pagesTotal; i++ {
		hasFlag := HasPageViewCountByName(pageNSList[i])
		fmt.Println("UpdatePageInsStatusInfo() page name: ", pageNSList[i], ", hasFlag: ", hasFlag)
		if hasFlag {
			pageViewsTotal += GetPageViewCountByName(pageNSList[i])
		} else {
			ns := pageNSList[i]
			insertPageStRecord(pageSTNodesTotal+1+i, ns)
			var node PageStatusNode
			node.name = ns
			node.count = 0
			pageSTNodeMap[node.name] = &node
			total++
		}
	}
	pageSTNodesTotal += total

	// parse config json
	pathStr := "./static/voxweb3d/demos/info.json"
	jsonFile, err := os.OpenFile(pathStr, os.O_RDONLY, os.ModeDevice)
	if err == nil {
		defer jsonFile.Close()
		fi, _ := jsonFile.Stat()
		fileBytesTotal := int(fi.Size())
		fmt.Println("fileBytesTotal: ", fileBytesTotal)

		jsonValue, _ := ioutil.ReadAll(jsonFile)

		// var insInfo map[string]interface{}
		var insInfo InsInfoJson
		json.Unmarshal([]byte(jsonValue), &insInfo)

		total = 0
		demos := insInfo.Demos
		demosTotal := len(demos)
		fmt.Println("UpdatePageInsStatusInfo() insInfo.demosTotal: ", demosTotal)
		for i := 0; i < demosTotal; i++ {
			item := demos[i]
			ns := "demo-ins-" + item.Name
			hasFlag := HasPageViewCountByName(ns)
			// fmt.Println("UpdatePageInsStatusInfo() insInfo.item.Name: ", item.Name, ", hasFlag: ", hasFlag)
			if hasFlag {
				pageViewsTotal += GetPageViewCountByName(ns)
			} else {
				insertPageStRecord(pageSTNodesTotal+1+i, ns)
				var node PageStatusNode
				node.name = ns
				node.count = 0
				pageSTNodeMap[node.name] = &node
				total++
			}
		}
		pageSTNodesTotal += total
		fmt.Println("UpdatePageInsStatusInfo() pageSTNodesTotal: ", pageSTNodesTotal)
	} else {
		fmt.Printf("UpdatePageInsStatusInfo() failed,err%v\n", err)
	}
	pageViewsTotal -= GetPageViewCountByName("website-renderCase")
}

func HasPageViewCountByName(ns string) bool {
	_, hasKey := pageSTNodeMap[ns]
	return hasKey
}
func GetPageViewCountByName(ns string) int {
	node, hasKey := pageSTNodeMap[ns]
	if hasKey {
		return node.count
	}
	return 0
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
		UpdateSitePageReqCountByID(node.count, node.id)
		return node.count
	}
	return 0
}

// func GetPageViewCountByID(id int) int {
// 	return pageReqCounts[id]
// }
// func UpdatePageViewCountPlusOneByID(id int) {
// 	pageReqCounts[id]++
// 	UpdateSitePageReqCountByID(pageReqCounts[id], id)
// }

//	func GetHomePageViewCount() int {
//		return pageReqCounts[homePageSTID]
//	}
//
//	func UpdateHomePageViewCount() {
//		QuerySitePageReqCountByID(1)
//		pageReqCounts[homePageSTID]++
//		UpdateSitePageReqCountByID(pageReqCounts[homePageSTID], homePageSTID)
//	}
//
//	func UpdateHomePageViewCountPlusOne() {
//		// QuerySitePageReqCountByID(1)
//		pageReqCounts[homePageSTID]++
//		UpdateSitePageReqCountByID(pageReqCounts[homePageSTID], homePageSTID)
//	}
func QuerySitePageReqCountByID(id int) {

	sqlStr := "select id, name, count from pagestatus where id=?;"
	rowObj := web_pst_db.QueryRow(sqlStr, id)

	var st PageStatusNode
	rowObj.Scan(&st.id, &st.name, &st.count)
	// web_site_req_all_req_count = st.count
	pageReqCounts[id] = st.count
	// fmt.Printf("QuerySitePageReqCountByID(), st: %#v\n", st)
	// fmt.Printf("QuerySitePageReqCountByID(), pageReqCounts[%d]: %#v\n", id, pageReqCounts[id])
}

func UpdateSitePageReqCountByID(count int, id int) {
	sqlStr := `update pagestatus set count=? where id=?`
	ret, err := web_pst_db.Exec(sqlStr, count, id)
	if err != nil {
		fmt.Printf("update failed ,err:%v\n", err)
		return
	}
	n, _ := ret.RowsAffected()
	n += 1
	// fmt.Printf("UpdateSitePageReqCountByID(), 更新了 %d 行数据\n", n)
}
