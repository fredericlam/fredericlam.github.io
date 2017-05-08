import pandas as pd

a = pd.read_csv("../data/caracteristiques_2015.csv")
b = pd.read_csv("../data/lieux_2015.csv")
b = b.dropna(axis=1)
merged = a.merge(b, on='Num_Acc')
merged.to_csv("../data/dataset.csv", index=False)