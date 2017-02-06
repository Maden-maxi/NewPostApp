<?php
require_once 'DB.interface.php';
/**
* DB
*/
class DB
{
    const DB_HOST = 'localhost';
	const DB_NAME = 'new_post';
	const DB_DRIVER = 'mysql';
    const DB_USER = 'root';
    const DB_PASSWORD = '';
    private $db_exist = false;
	protected $_db;
	
	public function __construct()
	{
        $dsn = self::DB_DRIVER . ':host=' . self::DB_HOST . ';dbname=' . self::DB_NAME;
        $this->_db = new PDO( $dsn, self::DB_USER, self::DB_PASSWORD);
        //$this->_db = new PDO( self::DB_DRIVER . ':' . self::DB_NAME );
		$this->_db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
        if($this->_db){

            if( $this->db_exist === true ) {
                try {

                    $this->_db->beginTransaction();

                    $query = "CREATE TABLE users(
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        LastName VARCHAR(255) NOT NULL,
                        FirstName VARCHAR(255) NOT NULL,
                        MiddleName VARCHAR(255) NOT NULL,
                        Phone VARCHAR(10) UNIQUE NOT NULL,
                        AreaRef VARCHAR(36) NOT NULL,
                        AreaDescription CHARACTER(255) NOT NULL,
                        CityRef VARCHAR(36) NOT NULL,
                        CityDescription CHARACTER(255) NOT NULL,
                        Email VARCHAR(255) UNIQUE NOT NULL,
                        Password VARCHAR(255) NOT NULL,
                        CounterpartyType VARCHAR(255) NOT NULL,
                        CounterpartyProperty VARCHAR(255) NOT NULL,
                        RegTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )";
                    $this->_db->exec($query);

                    $query = "CREATE TABLE express_overheads(
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        user_id BIGINT NOT NULL,
                        DateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        CargoType VARCHAR(255) NOT NULL,
                        ServiceType VARCHAR(255) NOT NULL,
                        Description VARCHAR(255) NOT NULL,
                        Cost INT NOT NULL,
                        conterparty INT,
                        Warehouse VARCHAR(255),
                        TypeOfPayers VARCHAR (255),
                        TypeOfPayersForRedelivery VARCHAR(255),
                        PrintStatus BOOLEAN DEFAULT FALSE,
                        RegTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id)
                    )";
                    $this->_db->exec($query);

                    $query = "CREATE TABLE recipients(
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        express_overhead_id BIGINT,
                        LastName VARCHAR(255) NOT NULL,
                        FirstName VARCHAR(255) NOT NULL,
                        Phone VARCHAR(10) NOT NULL,
                        Email VARCHAR(255) UNIQUE NOT NULL,
                        Area VARCHAR(255) NOT NULL,
                        City VARCHAR(255) NOT NULL,
                        Street VARCHAR(255),
                        House VARCHAR(255),
                        Flat VARCHAR(255),
                        RegTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (express_overhead_id) REFERENCES express_overheads(id)
                    )";
                    $this->_db->exec($query);

                    $query = "CREATE TABLE locations(
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        express_overhead_id BIGINT,
                        Width INT NOT NULL,
                        Height INT NOT NULL,
                        Length INT NOT NULL,
                        Volume INT NOT NULL,
                        Weight INT NOT NULL,
                        RegTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (express_overhead_id) REFERENCES express_overheads(id)
                    )";
                    $this->_db->exec($query);

                    $this->db_exist = true;

                } catch (PDOException $e) {
                    $data = 'Code error: ' . $e->getCode() . '; <br> Error info: ' . $e->getMessage();
                    $data .= 'Error code:' . $e->getCode() . ";\n";
                    $data .= 'Error message:' . $e->getMessage() . ";\n";
                    $data .= 'File:' . $e->getFile() . '. Line:' . $e->getLine() . "\n\n";
                    file_put_contents('error.log', $data);
                    $this->_db->rollBack();
                    $this->db_exist = false;
                    var_dump($e);
                }
            }
        }
	}
	public function __destruct()
	{
		$this->_db = null;
	}
	public function createUser($user)
	{
		$hash = password_hash($user['password'], PASSWORD_DEFAULT);
		$stmt = $this->_db->prepare("
			INSERT INTO users(LastName, FirstName, MiddleName, Phone, AreaRef, AreaDescription, CityRef, CityDescription, Email, Password, CounterpartyType, CounterpartyProperty)
			VALUES(:lastName, :firstName, :middleName, :phone, :areaRef, :areaDescription, :cityRef, :cityDescription, :email, :password, :counterpartyType, :counterpartyProperty)
		");
        try{
            $stmt->execute([
                ':lastName' => $user['LastName'],
                ':firstName' => $user['FirstName'],
                ':middleName' => $user['MiddleName'],
                ':phone' => $user['Phone'],
                ':areaRef' => $user['AreaRef'],
                ':areaDescription' => $user['AreaDescription'],
                ':cityRef' => $user['CityRef'],
                ':cityDescription' => $user['CityDescription'],
                ':email' => $user['Email'],
                ':password' => $hash,
                ':counterpartyType' => $user['CounterpartyType'],
                ':counterpartyProperty' => $user['CounterpartyProperty']
            ]);
            header('Created', true, 201);
        } catch ( PDOException $e ){
            header('Something wrong', true, 400);
            $errors = [ 'error' => [
                'code' => $e->getCode(),
                'message' => $e->getMessage(),
                'info' => $e->errorInfo,
                'trace' => $e->getTraceAsString()
            ] ];
            echo json_encode($errors);
        }

	}
	public function authUser($email, $password)
	{
		$stmt = $this->_db->prepare("SELECT * FROM users WHERE Email = :email");
        try{
            $stmt->execute( [":email" => $email] );
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($password, $user['Password'])){
                $data = [
                    'user' => [
                        'id' => $user['id'],
                        'FirstName' => $user['FirstName'],
                        'LastName' => utf8_decode( $user['LastName'] ),
                        'MiddleName' => $user['MiddleName'],
                        'Phone' => $user['Phone'],
                        'Email' => $user['Email'],
                        'AreaRef' => $user['AreaRef'],
                        'AreaDescription' => $user['AreaDescription'],
                        'CityRef' => $user['CityRef'],
                        'CityDescription' => $user['CityDescription'],
                        'CounterpartyType' => $user['CounterpartyType'],
                        'CounterpartyProperty' => $user['CounterpartyProperty']
                    ],
                    'cookie' => [
                        'authdata' => base64_encode( $user['Email'] . ':' . $user['Password'] ),
                        'user_id' => $user['id'],
                    ]
                ];
                echo json_encode($data);
            } else{
                header('Unauthorized', false, 401);
                $errors = [ 'error' => [
                    'code' => 0,
                    'message' => 'Невірний логін чи пароль'
                ] ];
                echo json_encode($errors);
            }
        } catch (PDOException $e) {
            header('Unauthorized', false, 401);
            $errors = [ 'error' => [
                'code' => $e->getCode(),
                'message' => $e->getMessage(),
                'info' => $e->errorInfo,
                'trace' => $e->getTraceAsString()
            ] ];
            echo json_encode($errors);
        }
	}

	public function createExpressOverhead($eo, $recipient, $locations) {

	    $stmt = $this->_db->prepare("
	        INSERT INTO express_overheads( DateTime, ServiceType, Warehouse, TypeOfPayers, TypeOfPayersForRedelivery, CargoType, Cost, Description) 
	        VALUES ( :dateTime, :serviceType, :warehouse, :conterparty, :typeOfPayers, :typeOfPayersForRedelivery, :cargoType, :cost, :description)
	    ");

        $stmt->execute([
            ':dateTime' => $eo['DateTime'],
            ':serviceType' => 'dasda',
            ':warehouse' => 'warh',
            ':typeOfPayers' => 'sdas',
            ':conterparty' => 1,
            ':typeOfPayersForRedelivery' => 'srere',
            ':cargoType' => 'srt',
            ':cost' =>  111,
            ':description' => 'text'
        ]);

	    /*$this->_db->exec("
          INSERT INTO express_overheads(user_id, DateTime, ServiceType, Warehouse, conterparty, TypeOfPayers, TypeOfPayersForRedelivery, CargoType, Cost, Description) 
          VALUES(${eo['user_id']}, ${eo['DateTime']}, ${eo['ServiceType']}, ${eo['Warehouse']}, ${eo['conterparty']}, ${eo['TypeOfPayers']}, ${eo['TypeOfPayersForRedelivery']}, ${eo['CargoType']}, ${eo['Cost']}, ${eo['Description']})
        ");*/

        //$this->_db->query("SELECT id FROM express_overheads WHERE user_id = ${eo['user_id']}");

        //$this->createRecipient($recipient);

        //$this->createLocations($locations);
    }

    public function createRecipient($recipient) {
        $this->_db->exec("
            INSERT INTO recipients(express_overhead_id, Area, City, Street, House, Flat, FirstName, LastName, Email, Phone)
            VALUES(${recipient['express_overhead_id']}, ${recipient['Area']}, ${recipient['City']}, ${recipient['Street']}, ${recipient['House']}, ${recipient['Flat']}, ${recipient['FirstName']}, ${recipient['LastName']}, ${recipient['Email']}, ${recipient['Phone']})
        ");
    }
    public function createLocations($locations) {
        foreach ($locations as $location) {
            $this->_db->exec("
            INSERT INTO locations(express_overhead_id, Width, Height, Length, Weight)
            VALUES(${location['express_overhead_id']}, ${location['Width']}, ${location['Height']}, ${location['Length']}, ${location['Weight']})
        ");
        }

    }
}
