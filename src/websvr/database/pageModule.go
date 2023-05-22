package database

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"

	_ "github.com/go-sql-driver/mysql" // 导入包但不使用,相当于只调用init()初始化
)

// go mod init voxwebsvr.com/database

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

var pageSTNodeMap map[string]*PageStatusNode
var pageSTNodesTotal = 0
var pageViewsTotal = 0

var webPage_st_db *sql.DB = nil

func initPageModule(db *sql.DB) {

	webPage_st_db = db
	pageSTNodeMap = make(map[string]*PageStatusNode)

	fmt.Println("init page module ...")

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

	_, err := webPage_st_db.Exec(sqlStr)
	if err != nil {
		fmt.Printf("insertPageStRecord failed,err:%v\n", err)
	}
}
func insertPageStRecord(id int, name string) {
	sql := buildInsertPageStSQL(id, name)
	insertPageStRecordWithSQL(sql)
}

func initPageStInfoFromDB() {

	sqlStr := "select * from pagestatus;"
	rows, err := webPage_st_db.Query(sqlStr)
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

/*
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
	rowObj := webPage_st_db.QueryRow(sqlStr, id)

	var st PageStatusNode
	rowObj.Scan(&st.id, &st.name, &st.count)
}
func BuildUpdateSitePageReqCountByID(count int, id int) string {
	sqlStr := `update pagestatus set count=` + strconv.Itoa(count) + ` where id=` + strconv.Itoa(id) + `;`
	return sqlStr
}
func UpdateSitePageReqCountByID(count int, id int) {
	sqlStr := BuildUpdateSitePageReqCountByID(count, id)
	_, err := webPage_st_db.Exec(sqlStr)
	if err != nil {
		fmt.Printf("update failed ,err:%v\n", err)
		return
	}
}
func UpdateSitePageReqCountBySQLStr(sqlStr string) {
	// sqlStr := BuildUpdateSitePageReqCountByID(count, id)
	_, err := webPage_st_db.Exec(sqlStr)
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
	_, err := webPage_st_db.Exec(sqlStr, count, id)
	if err != nil {
		fmt.Printf("update failed ,err:%v\n", err)
		return
	}
}
//*/
