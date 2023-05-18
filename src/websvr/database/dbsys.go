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

UPDATE pagestatus SET name = 'tt' , cont = '100'  WHERE id = 10;
*/
type PageStatusNode struct {
	id       int
	name     string
	count    int
	oldCount int
	src      string
	info     string
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
	initPageStInfoFromDB()
	UpdatePageInsStatusInfo()
}
func buildInsertPageStSQL(id int, name string) string {
	idStr := strconv.Itoa(id)
	// sqlStr := `insert into person(id, name, count, src, info) values(0,"Lucy","a sunshine woman.")`
	sqlStr := `insert into pagestatus(id, name, count, src, info) values(`
	sqlStr += idStr + `,"` + name + `", 0, "non-src", "demo ins page");`
	return sqlStr
}

func insertPageStRecordWithSQL(sqlStr string) {

	_, err := web_pst_db.Exec(sqlStr)
	if err != nil {
		fmt.Printf("insertPageStRecord failed,err:%v\n", err)
	}
}
func insertPageStRecord(id int, name string) {
	sql := buildInsertPageStSQL(id, name)
	insertPageStRecordWithSQL(sql)
}
func InitWebPageStatusDB() (err error) {

	dsn := "root:123456@tcp(127.0.0.1:3306)/webpagestatus?charset=utf8&multiStatements=true" // 可执行多条语句
	// dsn := "root:123456@tcp(127.0.0.1:3306)/webpagestatus"

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
		node.oldCount = node.count
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
		ns := pageNSList[i]
		hasFlag := HasPageViewCountByName(ns)
		fmt.Println("UpdatePageInsStatusInfo() page name: ", ns, ", hasFlag: ", hasFlag)
		if hasFlag {
			pageViewsTotal += GetPageViewCountByName(ns)
		} else {
			insertPageStRecord(pageSTNodesTotal+1+i, ns)
			var node PageStatusNode
			node.name = ns
			node.count = 0
			node.oldCount = 0
			pageSTNodeMap[ns] = &node

			total++
		}
		pageSTNodeMap[ns].oldCount = pageSTNodeMap[ns].count
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
				node.oldCount = 0
				pageSTNodeMap[ns] = &node
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
	rowObj := web_pst_db.QueryRow(sqlStr, id)

	var st PageStatusNode
	rowObj.Scan(&st.id, &st.name, &st.count)
	// web_site_req_all_req_count = st.count
	pageReqCounts[id] = st.count
	// fmt.Printf("QuerySitePageReqCountByID(), st: %#v\n", st)
	// fmt.Printf("QuerySitePageReqCountByID(), pageReqCounts[%d]: %#v\n", id, pageReqCounts[id])
}
func BuildUpdateSitePageReqCountByID(count int, id int) string {
	sqlStr := `update pagestatus set count=` + strconv.Itoa(count) + ` where id=` + strconv.Itoa(id) + `;`
	return sqlStr
}
func UpdateSitePageReqCountByID(count int, id int) {
	sqlStr := BuildUpdateSitePageReqCountByID(count, id)
	_, err := web_pst_db.Exec(sqlStr)
	if err != nil {
		fmt.Printf("update failed ,err:%v\n", err)
		return
	}
}
func UpdateSitePageReqCountBySQLStr(sqlStr string) {
	// sqlStr := BuildUpdateSitePageReqCountByID(count, id)
	_, err := web_pst_db.Exec(sqlStr)
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
	_, err := web_pst_db.Exec(sqlStr, count, id)
	if err != nil {
		fmt.Printf("update failed ,err:%v\n", err)
		return
	}
}
