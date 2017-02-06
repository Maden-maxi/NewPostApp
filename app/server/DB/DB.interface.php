<?php
/**
 * @version 0.0.0
 */
interface IDB {
	
	/**
	 * Adding user to database
	 *
	 * @param array $user - user data
	 */
	public function createUser($user);

	/**
	 * Getting user email and password form db
	 * 
	 * @param string $email - user email
	 * @param string $password - user password
	 */
	function getUserCredentials($email, $password);

	/**
	 * Create express overhead in db
	 *
	 * @param array $express_overhead - express overhead data
	 */
	public function createExpressOverhead($express_overhead);

	/**
	 * Create receiver in db
	 *
	 * @param array $receiver - data about receiver
	 */
	public function createReceiver($receiver);

	/**
	 * Create location in db
	 *
	 * @param array $location - data about location
	 */
	public function createLocation($location);
}