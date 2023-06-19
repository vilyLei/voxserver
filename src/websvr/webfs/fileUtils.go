package webfs

import (
	"strings"
)

func GetFileNameSuffix(ns string) string {

	if strings.Contains(ns, ".") {
		parts := strings.Split(ns, ".")
		pns := parts[len(parts)-1]
		return strings.ToLower(pns)
	}
	return ""
}
