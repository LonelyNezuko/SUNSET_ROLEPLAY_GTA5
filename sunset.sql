-- phpMyAdmin SQL Dump
-- version 4.9.4
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Окт 09 2021 г., 12:58
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

INSERT INTO `characters` (`id`, `userID`, `lastDate`, `userCreate`, `position`, `cash`, `gender`, `skin`, `clothes`, `charname`, `dateBirth`, `nationality`, `keyBinds`, `chatsettings`, `quests`) VALUES
(7, 2, '2021-09-28 01:22:01', 1, '{\"x\":-82.43140411376953,\"y\":6340.60205078125,\"z\":31.490371704101562,\"a\":-117.633544921875,\"vw\":0}', 400234000, 1, '{\"pedigree\":{\"one\":38,\"two\":27,\"looks\":0.5,\"skin\":0.3},\"hair\":{\"color\":12,\"head\":2,\"eyebrow\":11,\"beard\":16,\"breast\":14},\"face\":[\"0.8\",\"0.2\",\"-1.0\",\"0.3\",\"0.6\",\"-0.1\",\"-0.0\",\"-0.9\",\"-0.5\",\"0.3\",\"0.1\",\"0.1\",\"-0.6\",\"-0.5\",\"-1.0\",\"-0.8\",\"-1.0\",\"-0.6\",\"-0.9\",\"-0.9\"],\"appearance\":[22.221322906312402,24.92626441260384,1.9182443020537554,8.75105134137559,1.8332220147546365,9.336684334487215,13.321276908494653,17.666831506447192,1.5545348852734353]}', '{\"mask\":0,\"torsos\":3,\"legs\":4,\"bags\":0,\"shoes\":0,\"accessories\":0,\"undershirts\":15,\"armour\":0,\"decals\":0,\"tops\":3,\"head\":0}', 'Nezuko Kamado', '2001-01-12 21:24:05', 0, '{\"toggleVehicleEngine\":{\"name\":\"2\",\"key\":50,\"desc\":\"Завести/Заглушить двигатель\"},\"toggleVehicleLocked\":{\"name\":\"L\",\"key\":76,\"desc\":\"Закрыть/Открыть двери транспорта\"},\"toggleVehicleBelt\":{\"name\":\"K\",\"key\":75,\"desc\":\"Ремень безопастности\"},\"action\":{\"name\":\"E\",\"key\":69,\"desc\":\"Взаимодействие\"},\"fastAdminMenu\":{\"name\":\"8\",\"key\":56,\"desc\":\"Быстрое админ-меню\",\"admin\":1}}', '{\"timestamp\":true}', '[{\"name\":\"Первый тестовый квест\",\"line\":\"Тест\",\"desc\":\"Это тестовый квест для тестов\",\"tasks\":[{\"name\":\"Поговорить с Эдвардом\",\"maxProgress\":1,\"progress\":1},{\"name\":\"Арендовать скутер\",\"maxProgress\":1,\"progress\":1}],\"prize\":{\"desc\":\"$ 100.000.000\",\"data\":{\"cash\":100000000}},\"owner\":{\"type\":\"System\",\"name\":\"system\",\"position\":[0,0,0]},\"deleted\":false,\"status\":\"completed\"}]'),
(15, 10, '2021-10-09 12:56:29', 1, '{\"x\":-83.78398132324219,\"y\":6323.48974609375,\"z\":31.490367889404297,\"a\":130.18215942382812,\"vw\":0}', 1200, 0, '{\"genetic\":{\"mother\":0,\"father\":0,\"similarity\":0.5,\"skinTone\":0.5},\"hair\":{\"color\":0,\"head\":0,\"eyebrow\":0,\"beard\":0,\"breast\":0},\"face\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\"appearance\":[0,0,0,0,0,0,0,0,0]}', '{}', 'No Name', '2021-09-28 15:51:21', 0, '{\"toggleVehicleEngine\":{\"name\":\"2\",\"key\":50,\"desc\":\"Завести/Заглушить двигатель\"},\"toggleVehicleLocked\":{\"name\":\"L\",\"key\":76,\"desc\":\"Закрыть/Открыть двери транспорта\"},\"toggleVehicleBelt\":{\"name\":\"K\",\"key\":75,\"desc\":\"Ремень безопастности\"},\"action\":{\"name\":\"E\",\"key\":69,\"desc\":\"Взаимодействие\"},\"fastAdminMenu\":{\"name\":\"8\",\"key\":56,\"desc\":\"Быстрое админ-меню\",\"admin\":1},\"savePosition\":{\"name\":\"F8\",\"key\":119,\"desc\":\"Сохранить координаты\",\"admin\":5},\"chatOpen\":{\"name\":\"T\",\"key\":84,\"desc\":\"Открыть чат\"},\"chatClose\":{\"name\":\"ESC\",\"key\":27,\"desc\":\"Закрыть чат\"}}', '{\"timestamp\":false}', '[{\"name\":\"Первый тестовый квест\",\"line\":\"Тест\",\"desc\":\"Это тестовый квест для тестов\",\"tasks\":[{\"name\":\"Поговорить с Эдвардом\",\"maxProgress\":1,\"progress\":0},{\"name\":\"Арендовать скутер\",\"maxProgress\":1,\"progress\":0}],\"prize\":{\"desc\":\"$ 100.000.000\",\"data\":{\"cash\":100000000}},\"owner\":{\"type\":\"System\",\"name\":\"system\",\"position\":[0,0,0]},\"deleted\":false,\"status\":\"process\"}]');

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

INSERT INTO `houses` (`id`, `type`, `class`, `owner`, `position`, `dimension`, `interior`, `price`, `garage`, `locked`) VALUES
(21, 0, 0, '{ \"id\": 0, \"name\": \"Неимеется\" }', '{\"x\":-727.3677368164062,\"y\":-656.2129516601562,\"z\":29.2691650390625}', 0, '{\"x\":265.9913635253906,\"y\":-1007.3116455078125,\"z\":-101.00852966308594,\"a\":-3.0419886112213135}', 123, '{\"house\":{\"x\":179.09864807128906,\"y\":-1000.412353515625,\"z\":-98.99988555908203,\"a\":179.90341186523438},\"vehicle\":{\"x\":172.21388244628906,\"y\":-1004.741455078125,\"z\":-99.42455291748047,\"a\":-176.66537475585938},\"character\":{\"x\":172.1881561279297,\"y\":-1008.0836181640625,\"z\":-98.99988555908203,\"a\":-1.3001947402954102},\"position\":{\"x\":0,\"y\":0,\"z\":0,\"a\":0}}', 0),
(22, 0, 0, '{ \"id\": 0, \"name\": \"Неимеется\" }', '{\"x\":-81.08006286621094,\"y\":6329.3662109375,\"z\":30.490365982055664}', 0, '{\"x\":265.9913635253906,\"y\":-1007.3116455078125,\"z\":-101.00852966308594,\"a\":-3.0419886112213135}', 75990, '{\"house\":{\"x\":179.09864807128906,\"y\":-1000.412353515625,\"z\":-98.99988555908203,\"a\":179.90341186523438},\"vehicle\":{\"x\":172.21388244628906,\"y\":-1004.741455078125,\"z\":-99.42455291748047,\"a\":-176.66537475585938},\"character\":{\"x\":172.1881561279297,\"y\":-1008.0836181640625,\"z\":-98.99988555908203,\"a\":-1.3001947402954102},\"position\":{\"x\":0,\"y\":0,\"z\":0,\"a\":0}}', 0),
(23, 1, 1, '{ \"id\": 0, \"name\": \"Неимеется\" }', '{\"x\":-75.50286102294922,\"y\":6333.20263671875,\"z\":30.4903564453125}', 0, '{\"x\":-1450.154296875,\"y\":-525.7163696289062,\"z\":56.929039001464844,\"a\":29.834333419799805}', 5023, '{\"house\":{\"x\":0,\"y\":0,\"z\":0,\"a\":0},\"vehicle\":{\"x\":0,\"y\":0,\"z\":0,\"a\":0},\"character\":{\"x\":0,\"y\":0,\"z\":0,\"a\":0},\"position\":{\"x\":0,\"y\":0,\"z\":0,\"a\":0}}', 0);

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

INSERT INTO `users` (`id`, `username`, `password`, `email`, `regDate`, `lastDate`, `regIP`, `lastIP`, `admin`, `adminData`, `promo`) VALUES
(2, 'MyAngelNezuko', '1444e0f8ad7f76adb90b9c07e9a09d5002d6161e015f4eecc2ffa694dc9a05e9', 'myangelnezuko@yandex.ru', '2021-09-14 21:12:03', '2021-09-28 01:22:01', '127.0.0.1', '127.0.0.1', 5, '{\"resetDate\":\"2021-09-15T07:57:16.901Z\",\"resetUsername\":\"MyAngelNezuko\",\"lastLevel\":5}', '{}'),
(10, 'TestUser1', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'asdas@maiol.sd', '2021-09-28 15:51:20', '2021-10-09 12:56:29', '127.0.0.1', '127.0.0.1', 5, '{}', '{\"name\":\"\",\"enable\":false}');

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

INSERT INTO `vehicles` (`id`, `model`, `position`, `heading`, `dimension`, `owner`, `locked`, `number`, `color`, `mileage`, `fuel`) VALUES
(6, 't20', '{\"x\":-517.3497924804688,\"y\":-668.698974609375,\"z\":33.0715446472168}', 0.493153, 0, '{\"player\":7}', 0, 'NONE', '[[255,255,255],[255,255,255]]', 0, 40),
(7, 't20', '{\"x\":227.19366455078125,\"y\":-987.7410278320312,\"z\":-99.42381286621094}', -164.103, 65, '{\"player\":7}', 0, 'NONE', '[[255,255,255],[255,255,255]]', 0, 40),
(9, 't20', '{\"x\":225.5995330810547,\"y\":-994.8980712890625,\"z\":-99.42389678955078}', -138.418, 67, '{\"player\":7}', 0, 'NONE', '[[255,255,255],[255,255,255]]', 0, 40);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `characters`
--
ALTER TABLE `characters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `houses`
--
ALTER TABLE `houses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
