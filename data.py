import pandas as pd

data = pd.read_csv('./DATA1.csv')
metadata = pd.read_csv('./metadata_NEW.csv')



#first delete de column metadata of DATA1.csv
data_new = data.drop(['metadata'], axis=1)

#second, the column date of DATA1.csv that has the format '2019-05-02T00:01:28-05:00', separarate the date and the time, then year month and day

data_new ['date'] = pd.to_datetime(data_new ['date'])
data_new ['year'] = data_new ['date'].dt.year
data_new ['month'] = data_new ['date'].dt.month
data_new ['day'] = data_new ['date'].dt.day

#third, the column time of DATA1.csv that has the format '2019-05-02T00:01:28-05:00', separarate the date and the time, then hour, minute and second

# data_new ['date'] = pd.to_datetime(data_new ['date'])
data_new ['hour'] = data_new ['date'].dt.hour
data_new ['minute'] = data_new ['date'].dt.minute

#fourth, delete the column date of data_new

data_new = data_new.drop(['date'], axis=1)

#fifth, join the metadata at the end of data_new

data_new = data_new.join(metadata)

#sixth, stay only with this columns['ticket_number', 'method', 'transaction_status', 'brand', 'transaction_type', 'processor_name', 'security', 'paper', 'year', 'month', 'day', 'hour', 'minute', 'Type', 'kind', 'Numeric', 'name', 'id', 'transactionId', 'user', 'transactionResult', 'token', 'id3', 'office', 'documentType']
data_new = data_new[['ticket_number', 'method', 'transaction_status', 'brand', 'transaction_type', 'processor_name', 'year', 'month', 'day', 'hour', 'minute', 'Type', 'kind', 'Numeric', 'name', 'id', 'transactionId']]


data_new = data_new.dropna()



# save the new data in a new csv file

data_new.to_csv('DATA_NEW.csv', index=False)