package handler

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"time"
)

const GITHUB_BASE_URL string = "https://api.github.com"

func getRepoStats() map[string]interface{} {
	req, _ := http.NewRequest(http.MethodGet, GITHUB_BASE_URL+"/repos/jeremy-misola/living-portfolio", nil)
	req.Header.Add("Authorization", os.Getenv("GITHUB_PAT"))

	client := &http.Client{Timeout: 10 * time.Second}
	resp, _ := client.Do(req)

	body, _ := io.ReadAll(resp.Body)
	var githubResponse map[string]interface{}
	json.Unmarshal([]byte(string(body)), &githubResponse)

	appResponse := map[string]interface{}{
		"pushed_at":         githubResponse["pushed_at"],
		"open_issues_count": githubResponse["open_issues_count"],
		"stargazers_count":  githubResponse["stargazers_count"],
	}

	return appResponse
}

func getReleaseStats() map[string]interface{} {
	req, _ := http.NewRequest(http.MethodGet, GITHUB_BASE_URL+"/repos/jeremy-misola/living-portfolio/releases/latest", nil)
	req.Header.Add("Authorization", os.Getenv("GITHUB_PAT"))

	client := &http.Client{Timeout: 10 * time.Second}
	resp, _ := client.Do(req)

	body, _ := io.ReadAll(resp.Body)
	var githubResponse map[string]interface{}
	json.Unmarshal([]byte(string(body)), &githubResponse)

	appResponse := map[string]interface{}{
		"release_name": githubResponse["name"],
		"tag_name":     githubResponse["tag_name"],
	}

	return appResponse
}

func GetRepositoryStats(w http.ResponseWriter, r *http.Request) {
	releaseStats := getReleaseStats()
	repoStats := getRepoStats()
	aggregatedRepoStats := mergeMaps(repoStats, releaseStats)

	finalJSON, err := json.MarshalIndent(aggregatedRepoStats, "", "\t")
	if err != nil {
		http.Error(w, "error decoding", 500)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(finalJSON)

}

func mergeMaps(map1, map2 map[string]any) map[string]any {
	merged := map[string]any{}

	for k, v := range map1 {
		merged[k] = v
	}
	for k, v := range map2 {
		merged[k] = v
	}

	return merged

}
