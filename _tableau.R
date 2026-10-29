creer_tableau <- function(champ, libelle, fichier, unite = "personnes",
                          geojson = "../layers/indicateurs_debce.geojson",
                          dossier = "../tableaux") {
  library(sf); library(dplyr); library(reactable); library(htmlwidgets)
  
  d <- st_read(geojson, quiet = TRUE) %>%
    st_drop_geometry() %>%
    select(`Code INSEE` = insee_com, Commune = nom, Population = population,
           !!libelle := all_of(champ))
  
  cols <- list(
    `Code INSEE` = colDef(align = "center"),
    Commune      = colDef(align = "center"),
    Population   = colDef(align = "center",
                          format = colFormat(separators = TRUE, locales = "fr-FR"))
  )
  
  cols[[libelle]] <- colDef(
    align = "center",
    na = "Non concerné",
    cell = function(value) {
      if (is.na(value))    "Non concerné"
      else if (value == 0) "Aucun"
      else if (value < 0)  paste("- de 20", unite)
      else format(value, big.mark = " ", scientific = FALSE)
    }
  )
  
  widget <- reactable(
    d,
    filterable = TRUE, striped = TRUE, sortable = TRUE, resizable = TRUE,
    pagination = TRUE, defaultPageSize = 10, highlight = TRUE,
    columns = cols,
    theme = reactableTheme(
      borderColor = "#E0E0E0", stripedColor = "#f5f5f5", highlightColor = "#7591e5",
      cellPadding = "8px 12px",
      style = list(fontFamily = "Avenir, Arial, sans-serif", fontSize = "16px",
                   fontWeight = "400", textAlign = "center"),
      headerStyle = list(fontFamily = "Avenir, Arial, sans-serif", fontWeight = "600",
                         textAlign = "center", fontSize = "16px", alignItems = "center",
                         backgroundColor = "#e5f0f0", borderRadius = "8px", color = "cadetblue")
    )
  )
  
  dir.create(dossier, showWarnings = FALSE, recursive = TRUE)
  htmlwidgets::saveWidget(widget, file.path(dossier, fichier), selfcontained = FALSE, libdir = "lib")
  
  widget
}