-- phpMyAdmin SQL Dump
-- version 4.9.4
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Ноя 08 2021 г., 12:30
-- Версия сервера: 10.3.13-MariaDB-log
-- Версия PHP: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `sunset`
--

-- --------------------------------------------------------

--
-- Структура таблицы `business`
--

CREATE TABLE `business` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `owner` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `position` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `dimension` int(11) NOT NULL,
  `locked` int(11) NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `business`
--

-- --------------------------------------------------------

--
-- Структура таблицы `characters`
--

CREATE TABLE `characters` (
  `id` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `lastDate` datetime NOT NULL DEFAULT current_timestamp(),
  `userCreate` int(11) NOT NULL DEFAULT 0,
  `position` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `cash` float NOT NULL DEFAULT 1200,
  `gender` int(11) NOT NULL DEFAULT 0,
  `skin` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `clothes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `charname` varchar(144) NOT NULL DEFAULT 'No Name',
  `dateBirth` datetime NOT NULL DEFAULT current_timestamp(),
  `nationality` int(11) DEFAULT 0,
  `keyBinds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `chatsettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `quests` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `characters`
--

-- --------------------------------------------------------

--
-- Структура таблицы `houses`
--

CREATE TABLE `houses` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `class` int(11) NOT NULL,
  `owner` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `position` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `dimension` int(11) NOT NULL,
  `interior` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `price` int(11) NOT NULL,
  `garage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `locked` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `houses`
--

-- --------------------------------------------------------

--
-- Структура таблицы `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `target` int(11) NOT NULL,
  `text` text NOT NULL,
  `type` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `logs`
--

-- --------------------------------------------------------

--
-- Структура таблицы `promocodes`
--

CREATE TABLE `promocodes` (
  `id` int(11) NOT NULL,
  `name` varchar(144) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `settings`
--

CREATE TABLE `settings` (
  `vehiclesData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `settings`
--

INSERT INTO `settings` (`vehiclesData`) VALUES
('{\"t20\":{\"maxSpeed\":120,\"maxFuel\":10,\"expensFuel\":5,\"price\":1,\"type\":\"vehicle\",\"typeName\":\"Транспорт\"},\"supra\":{\"maxSpeed\":120,\"maxFuel\":10,\"expensFuel\":5,\"price\":1,\"type\":\"vehicle\",\"typeName\":\"Транспорт\"},\"hauler2\":{\"maxSpeed\":120,\"maxFuel\":10,\"expensFuel\":5,\"price\":1,\"type\":\"vehicle\",\"typeName\":\"Транспорт\"},\"trailerlogs\":{\"maxSpeed\":120,\"maxFuel\":10,\"expensFuel\":5,\"price\":1,\"type\":\"vehicle\",\"typeName\":\"Транспорт\"},\"trailerAttached\":{\"maxSpeed\":120,\"maxFuel\":10,\"expensFuel\":5,\"price\":1,\"type\":\"vehicle\",\"typeName\":\"Транспорт\"}}');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `regDate` datetime DEFAULT current_timestamp(),
  `lastDate` datetime NOT NULL DEFAULT current_timestamp(),
  `regIP` varchar(16) NOT NULL,
  `lastIP` varchar(16) NOT NULL,
  `admin` int(11) NOT NULL DEFAULT 0,
  `adminData` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `promo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

-- --------------------------------------------------------

--
-- Структура таблицы `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `model` varchar(255) NOT NULL,
  `position` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `heading` float NOT NULL,
  `dimension` int(11) NOT NULL,
  `owner` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `locked` int(11) NOT NULL,
  `number` varchar(144) NOT NULL,
  `color` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `mileage` float NOT NULL DEFAULT 0,
  `fuel` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `vehicles`
--

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `business`
--
ALTER TABLE `business`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `houses`
--
ALTER TABLE `houses`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `business`
--
ALTER TABLE `business`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT для таблицы `characters`
--
ALTER TABLE `characters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT для таблицы `houses`
--
ALTER TABLE `houses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT для таблицы `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT для таблицы `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
