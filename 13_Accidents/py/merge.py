import pandas as pd

a = pd.read_csv("../data/caracteristiques_2015.csv")

# --- merge lieux --
b = pd.read_csv("../data/lieux_2015.csv")
b = b.dropna(axis=1, how='all')
merged = a.merge(b, on='Num_Acc')
merged.to_csv("../data/dataset.csv", index=False)

dataset = pd.read_csv("../data/dataset.csv")

# --- merge usagers --
# c = pd.read_csv("../data/usagers_2015.csv")
#c = c.dropna(axis=1, how='all')
#merged = dataset.merge(c, on='Num_Acc')
#merged.to_csv("../data/dataset.csv", index=False)

#dataset = pd.read_csv("../data/dataset.csv")

# --- merge usagers --
#d = pd.read_csv("../data/vehicules_2015.csv")
#d = c.dropna(axis=1, how='all')
#merged = dataset.merge(d, on='Num_Acc')
#merged.to_csv("../data/dataset.csv", index=False)


